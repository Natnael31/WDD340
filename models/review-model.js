const pool = require('../database/');

async function addReview(review_text, inv_id, account_id) {
    const sql = `INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *;`;
    return await pool.query(sql, [review_text, inv_id, account_id]);
}

async function getReviewById(review_id) {
    const sql = `SELECT * FROM review WHERE review_id = $1;`;
    return await pool.query(sql, [review_id]);
}

async function getReviewsByAccountId(account_id) {
    const sql = `SELECT * FROM review WHERE account_id = $1 ORDER BY review_date DESC;`;
    return await pool.query(sql, [account_id]);
}

async function getReviewsByInvId(inv_id) {
    const sql = `
    SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
    FROM review r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.inv_id = $1
    ORDER BY r.review_date DESC;`;
    return await pool.query(sql, [inv_id]);
}

async function updateReview(review_id, review_text) {
    const sql = `UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *;`;
    return await pool.query(sql, [review_text, review_id]);
}

async function deleteReview(review_id) {
    const sql = `DELETE FROM review WHERE review_id = $1;`;
    return await pool.query(sql, [review_id]);
}

module.exports = { addReview, getReviewById, getReviewsByAccountId, getReviewsByInvId, updateReview, deleteReview };