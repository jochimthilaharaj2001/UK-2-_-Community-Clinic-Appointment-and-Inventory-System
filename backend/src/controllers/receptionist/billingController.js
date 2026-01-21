import db from '../../config/db.js';

export const getInvoices = async (req, res) => {
    const { status, patient } = req.query;
    try {
        let query = `
            SELECT i.*, p.name as patient_name 
            FROM invoices i
            LEFT JOIN patients p ON i.patient_id = p.id
        `;
        const params = [];
        const conditions = [];

        if (status && status !== 'all') {
            conditions.push('i.status = ?');
            params.push(status);
        }

        if (patient) {
            conditions.push('p.name LIKE ?');
            params.push(`%${patient}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY i.created_at DESC';

        const [invoices] = await db.query(query, params);

        // Fetch services (items) for each invoice
        for (let inv of invoices) {
            const [items] = await db.query('SELECT description as name, amount FROM invoice_items WHERE invoice_id = ?', [inv.id]);
            inv.services = items.map(item => item.name); // Frontend expects array of strings or we adapt
            // Frontend: bill.services is ['Consultation', 'Lab']
        }

        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createInvoice = async (req, res) => {
    const { patientId, services } = req.body;
    // services: [{ description, amount }]

    try {
        // Calculate totals
        const totalAmount = services.reduce((sum, item) => sum + Number(item.amount), 0);
        const invoiceNo = `INV-${Date.now()}`; // Simple generator

        const [result] = await db.query(
            'INSERT INTO invoices (patient_id, invoice_no, total_amount, balance, status) VALUES (?, ?, ?, ?, ?)',
            [patientId, invoiceNo, totalAmount, totalAmount, 'Unpaid']
        );

        const invoiceId = result.insertId;

        // Insert items
        for (const s of services) {
            await db.query(
                'INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)',
                [invoiceId, s.description, s.amount]
            );
        }

        res.status(201).json({ message: 'Invoice created', invoiceId, invoiceNo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const processPayment = async (req, res) => {
    const { id } = req.params; // Invoice ID
    const { amount, method, notes } = req.body;

    try {
        const [inv] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
        if (inv.length === 0) return res.status(404).json({ message: 'Invoice not found' });

        const invoice = inv[0];
        const newPaid = Number(invoice.paid_amount) + Number(amount);
        const newBalance = Number(invoice.total_amount) - newPaid;

        let status = 'Partial';
        if (newBalance <= 0) status = 'Paid';
        if (newPaid === 0) status = 'Unpaid';

        // Update Invoice
        await db.query(
            'UPDATE invoices SET paid_amount = ?, balance = ?, status = ? WHERE id = ?',
            [newPaid, newBalance, status, id]
        );

        // Log Payment
        await db.query(
            'INSERT INTO payments (invoice_id, amount, method, notes) VALUES (?, ?, ?, ?)',
            [id, amount, method, notes]
        );

        res.json({ message: 'Payment processed', newBalance, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
