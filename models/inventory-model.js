const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");

};



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getInventoryDetail(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getinventoryID error " + error)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

async function addInventory(item) {
    const sql = `
    INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING inv_id;
  `;

    const values = [
        item.classification_id,
        item.inv_make,
        item.inv_model,
        item.inv_year,
        item.inv_description,
        item.inv_image,
        item.inv_thumbnail,
        item.inv_price,
        item.inv_miles,
        item.inv_color,
    ];

    try {
        const result = await pool.query(sql, values);
        return result.rows.length > 0;
    } catch (err) {
        console.error("Error inserting inventory:", err);
        return false;
    }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryDetail, addClassification, addInventory };

