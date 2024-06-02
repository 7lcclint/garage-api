const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(express.json());
const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");
console.log('Secret Key',secretKey)

const corsOptions = {
  origin: ['http://127.0.0.1:5173','http://localhost:5173','https://7lcclint.github.io'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('/reservationsByStatusAccept', cors());
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));

const db = mysql.createConnection({
  host: "34.143.179.46",
  user: "clint",
  password: "garageDB2024",
  database: "garages",
  port: 3306
});

const verify = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ Error: "Not authenticated. No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ Error: "Token is not valid" });
    }

    req.user_id = decoded.user_id;
    req.firstname = decoded.first_name;
    req.lastname = decoded.last_name;
    req.email = decoded.email;
    req.user_type = decoded.user_type;

    next();
  });
};

module.exports = verify;

app.post('/login', function (req, res) {
  const sql = "SELECT * FROM garages.user WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error on server" });
    }
    if (data.length === 0) {
      return res.json({ Error: "User not found" });
    }
    
    const user = data[0];
    if (req.body.password === user.password) {
      const { user_id, user_type, first_name, last_name, email } = user;
      const token = jwt.sign({ first_name, last_name, email, user_id, user_type }, secretKey, { expiresIn: '1d' });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none', // Can be 'strict', 'lax', or 'none'
      });
      console.log("User Data:", { user_id, user_type, first_name, last_name, email });
      return res.json({ Status: "Successfully", user_type, token });
    } else {
      return res.json({ Error: "Passwords do not match" });
    }
  });
});

app.post('/register', function (req, res) {
  const sql = "INSERT INTO garages.user (`first_name`, `last_name`, `email`, `password`, `user_type`) VALUES (?)";
  const VALUES = [
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.password,
    1
  ]
  db.query(sql, [VALUES], (err, result) => {
    if (err) {
      return res.json({Error: "Error registering user"});
    }
    res.json({Status: "Successfully"});
  })
})

app.get('/logout', (req, res) => {
    console.log("Logout");
    return res.json({ Status: "Successfully logged out" });
});
  

app.get('/getUserDataByEmail', verify, function (req, res) {
  const sql = "SELECT * FROM garages.user WHERE email = ?";
  db.query(sql, [req.email], (err, data) => {
    if (err) return res.json({ Error: "Error retrieving phone" });
    if (data.length > 0) {
        const userData = {
            Status: 'Successfully', 
            firstname: req.firstname,
            lastname: req.lastname,
            user_id: data[0].user_id,
            email: req.email,
            phone: data[0].phone,
            profile_picture: data[0].profile_picture,
            address_street: data[0].address_street,
            address_province: data[0].address_province,
            address_district: data[0].address_district,
            address_subdistrict: data[0].address_subdistrict,
            address_zipcode: data[0].address_zipcode,
            user_type: data[0].user_type
        };
    return res.status(200).json(userData);
    } else {
        return res.json({ Error: "Phone not found" });
    }
    });
});
  
app.put('/updateReserveData/:reserve_id', (req, res) => {
  const reserve_id = req.params.reserve_id;
  const { status } = req.body;

  const sql = `
    UPDATE reserve
    SET status = ?
    WHERE reserve_id = ?;
  `;

  const values = [status, reserve_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating reserve data' });
    } else if (result.changedRows === 0) {
      return res.status(500).json({ error: 'No rows were updated' });
    } else {
      return res.status(200).json({ message: 'reserve data updated successfully' });
    }
  });
});

app.get('/reservations', verify, (req, res) => {
    const user_id = req.user_id;
    const sql = 'SELECT reserve.*, user.* FROM reserve INNER JOIN user ON user.user_id = reserve.user_id WHERE user.user_id = ?';
    db.query(sql, [user_id], (err, data) => {
      if (err) {
        console.error('Error executing the SQL query:', err);
        return res.status(500).json({ error: 'Error retrieving reservations' });
      }
      res.status(200).json(data);
    });
});

app.get('/allReservations', verify, (req, res) => {
  const sql = `
    SELECT user.first_name,
           user.last_name,
           reserve.vehicle_reg,
           reserve.reserve_date,
           reserve.detail,
           reserve.status,
           reserve.reserve_id
    FROM reserve
    INNER JOIN user ON user.user_id = reserve.user_id
    where user.user_type not in(2,3)
  `;
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing the SQL query:', err);
      return res.status(500).json({ error: 'Error retrieving reservations' });
    }
    res.status(200).json(data);
  });
});


app.get('/reservationsByStatusAccept', (req, res) => {
  const procedureName = 'GetReservationsByStatusAccept'; 

  db.query(`CALL ${procedureName}`, (err, data) => {
    if (err) {
      console.error('Error executing the stored procedure:', err);
      return res.status(500).json({ error: 'Error calling the stored procedure' });
    }
    res.status(200).json(data[0]); 
  });
});

app.get('/repairData', verify, (req, res) => {
  const sql = `
    SELECT
      repair.repair_id,
      user.first_name,
      user.last_name,
      repair.full_service,
      repair.discount_service,
      DATE_FORMAT(repair.repair_date, '%Y-%m-%d') AS repair_date,
      repair.repair_detail,
      repair.repair_status,
      promotion.promotion_name
    FROM
      user
    INNER JOIN repair ON user.user_id = repair.user_id
    INNER JOIN promotion ON promotion.promotion_id = repair.promotion_id
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing the SQL query:', err);
      return res.status(500).json({ error: 'Error retrieving repair data' });
    }
    res.status(200).json(data);
  });
});

app.get('/repairData/:user_id', verify, (req, res) => {
  const user_id = req.params.user_id;
  const sql = `
    SELECT
      repair.repair_id,
      user.first_name,
      user.last_name,
      DATE_FORMAT(repair.repair_date, '%Y-%m-%d') AS repair_date,
      repair.repair_detail,
      repair.repair_status
    FROM
      user
    INNER JOIN repair ON user.user_id = repair.user_id
    WHERE user.user_id = ?;
  `;

  db.query(sql,user_id, (err, data) => {
    if (err) {
      console.error('Error executing the SQL query:', err);
      return res.status(500).json({ error: 'Error retrieving repair data' });
    }
    res.status(200).json(data);
  });
});

app.get('/getPromotions', (req, res) => {

  db.query(`SELECT promotion_id, promotion_name, promotion_detail, 
            promotion_code, money, percent, 
            DATE_FORMAT(start_date, '%d-%m-%Y') AS start_date, 
            DATE_FORMAT(end_date, '%d-%m-%Y') AS end_date, 
            promotion_status 
          FROM promotion`, (err, data) => {
    if (err) {
      console.error('Error executing the stored procedure:', err);
      return res.status(500).json({ error: 'Error calling the stored procedure' });
    }
    res.status(200).json(data); 
  });
});

app.put('/updateRepairData/:repairId', (req, res) => {
  const repairId = req.params.repairId;
  const { repair_status } = req.body;
  
  const sql = `
    UPDATE repair
    SET repair_status = ?
    WHERE repair_id = ?;
  `;

  const values = [repair_status, repairId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating repair data:', err);
      return res.status(500).json({ error: 'Error updating repair data' });
    } else if (result.changedRows === 0) {
      console.error('No rows were updated');
      return res.status(500).json({ error: 'No rows were updated' });
    } else {
      return res.status(200).json({ message: 'Repair data updated successfully' });
    }
  });
});

app.put('/update-user-data', verify, (req, res) => {
  const {user_id,firstName,lastName,phone,email,street,province,district,subdistrict,zipcode} = req.body;
  const sql = `
    UPDATE garages.user
    SET first_name = ?,
        last_name = ?,
        phone = ?,
        email = ?,
        address_street = ?,
        address_province = ?,
        address_district = ?,
        address_subdistrict = ?,
        address_zipcode = ?
    WHERE user_id = ?;
  `;

  const values = [ firstName, lastName, phone, email, street,
                   province,  district, subdistrict,  zipcode,
                  user_id ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      return res.status(500).json({ error: 'Error updating user data' });
    } else if (result.changedRows === 0) {
      console.error('No rows were updated');
      return res.status(500).json({ error: 'No rows were updated' })
    } else {
      //console.log('User data updated successfully');
      return res.status(200).json({ message: 'User data updated successfully' });
    }
  });
});

app.put('/change-password/:user_id', verify, (req, res) => {
  // 1. Extract Data
  const user_id = req.user_id;  // Assumes `verify` middleware sets req.user_id
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // 2. Input Validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' }); // Bad Request
  }

  // 3. Fetch User's Existing Password
  db.query('SELECT password FROM user WHERE user_id = ?', [user_id], (err, results) => {
    if (err) { 
      console.error('Error fetching user password:', err);
      return res.status(500).json({ error: 'Database error' }); // Internal Server Error (general)
    }

    // 4. Handle User Not Found
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' }); // Not Found
    }

    // 5. Compare Passwords
    const oldPassword = results[0].password;
    if (currentPassword === oldPassword) {

      // 6. Update Password if Correct
      db.query('UPDATE user SET password = ? WHERE user_id = ?', [newPassword, user_id], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ error: 'Error updating password' }); // Specific DB update error
        }

        if (result.affectedRows === 1) {
          return res.json({ message: 'Password updated successfully' }); // Success!
        } else {
          return res.status(500).json({ error: 'Password update failed' }); // Unexpected DB behavior
        }
      });

    } else { // Added error handling:
      return res.status(401).json({ error: 'Current password is incorrect' }); // Unauthorized
    }
  });
});

app.get('/getEmployees', verify, function (req, res) {
  const userTypeId = 2;
  const sql = "SELECT * FROM garages.user WHERE user_type = ?";
  db.query(sql, [userTypeId], (err, data) => {
    if (err) return res.json({ Error: "Error retrieving phone" });
    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.json({ Error: "Phone not found" });
    }
  });
});

app.put('/update-profile-picture/:user_id', verify, (req, res) => {
  const user_id = req.params.user_id;
  const base64Image = req.body.image; // Receive the base64 string from the frontend

  if (base64Image) {
    // Validate base64 string (check format, file type, size if needed)
    if (!base64Image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const sql = `
      UPDATE garages.user
      SET profile_picture = ?
      WHERE user_id = ?;
    `;

    db.query(sql, [base64Image, user_id], (err, result) => {
      if (err) {
        console.error('Error updating profile picture:', err);
        return res.status(500).json({ error: 'Error updating profile picture' });
      } else if (result.changedRows === 0) {
        return res.status(500).json({ error: 'No rows were updated' });
      } else {
        return res.status(200).json({ message: 'Profile picture updated successfully', profile_picture: base64Image });
      }
    });
  } else {
    res.status(400).json({ error: 'Image data not provided' });
  }
});

app.get('/fullReports', (req, res) => {
  db.query('CALL fullReports()', (error, results) => {
    if (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก Stored Procedure: ' + error);
      res.status(500).json({ error: 'พบข้อผิดพลดในการเรียก Stored Procedure' });
    } else {
      const formattedResults = results[0].map(result => ({
        ...result,
        repair_date: result.repair_date.toISOString().split('T')[0],
      }));
      res.json(formattedResults);
    }
  });
});

app.get('/promotionReportsByStartEnd', (req, res) => {

  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    res.status(400).json({ error: 'โปรดระบุวันที่เริ่มต้นและวันที่สิ้นสุด' });
    return;
  }

  db.query('CALL promotionReportsByStartEnd(?, ?)', [start_date, end_date], (err, results) => {
      if (err) {
          console.error('Error calling stored procedure: ' + err);
          res.status(500).json({ error: 'Error fetching data' });
          return;
      } else {
        const formattedResults = results[0].map(result => ({
          ...result,
        }));
        res.json(formattedResults);
      }
  });
});

app.get('/reportRevenueByStartEnd', (req, res) => {

  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    res.status(400).json({ error: 'โปรดระบุวันที่เริ่มต้นและวันที่สิ้นสุด' });
    return;
  }

  db.query('CALL reportRevenueByStartEnd(?, ?)', [start_date, end_date], (err, results) => {
      if (err) {
          console.error('Error calling stored procedure: ' + err);
          res.status(500).json({ error: 'Error fetching data' });
          return;
      } else {
        const formattedResults = results[0].map(result => ({
          ...result,
        }));
        res.json(formattedResults);
      }
  });
});

app.get('/reportRevenueAll', (req, res) => {
  db.query('CALL reportRevenueAll()', (err, results) => {
    if (err) {
      console.error('Error executing the stored procedure: ' + err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/fullReportsByStartEnd', (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    res.status(400).json({ error: 'โปรดระบุวันที่เริ่มต้นและวันที่สิ้นสุด' });
    return;
  }

  db.query('CALL fullReportsByStartEnd(?, ?)', [start_date, end_date], (error, results) => {
    if (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก Stored Procedure: ' + error);
      res.status(500).json({ error: 'พบข้อผิดพลดในการเรียก Stored Procedure' });
    } else {
      const formattedResults = results[0].map(result => ({
        ...result,
      }));
      res.json(formattedResults);
    }
  });
});

app.get('/reportRevenueByMonth/:year', (req, res) => {
  const year = req.params.year;

  db.query('CALL reportRevenueByMonth(?)', [year], (err, results) => {
    if (err) {
      console.error('Error calling stored procedure:', err);
      return res.status(500).json({ error: 'Error calling the stored procedure' });
    }

    const formattedResults = results[0].map(result => ({
      month: result.month,
      revenue: result.revenue,
    }));

    res.status(200).json(formattedResults);
  });
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.listen(3456, () => {
  console.log("Server running on port 3456");
});