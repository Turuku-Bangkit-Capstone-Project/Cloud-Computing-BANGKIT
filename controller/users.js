import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


export const users = async (req, res) => {
  try {
      const users = await Users.findAll({
          attributes: ['name'],
          where: {
              id: req.userId // Menggunakan req.userId yang sudah diset
          }
      });
      res.json(users);
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Terjadi kesalahan saat mengambil data pengguna" });
  }
}

//function register
export const register = async (req, res) => {
  dotenv.config();
  const {
    name,
    email,
    password,
    confPassword
  } = req.body;  

  if (password !== confPassword) 
    return res.status(400).json({msg: "Password dan Confirm Password tidak cocok, silakan coba lagi"});
  
  if (!email.includes("@")) {
    return res.status(400).json({ msg: "Email harus memiliki simbol '@'" });
  }
  
  //validasi password mnggunakan regex harus memiliki minimal 1 angka,1 huruf, 1 symbol dan minimal 8 huruf
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ msg: "Password harus memiliki minimal 8 karakter dan setidaknya satu angka" });
  }

  //jika pass cocok
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword
    });
    //jika users berhasil tersimpan ke dalam db
    res.json({msg: "Register Berhasil"});
  } catch (error) {
    console.log(error);
  }
} 

//function login
export const login = async (req, res) => {
  dotenv.config();
  try {
      const user = await Users.findAll({
          where: {
              email: req.body.email
          }
      }); 
      const match = await bcrypt.compare(req.body.password, user[0].password);
      if (!match) return res.status(400).json({msg: "Password salah"});

      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;

      // Membuat akses token dengan userId
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '20s'
      });

      const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '1d'
      });

      await Users.update({ refresh_token: refreshToken }, {
          where: {
              id: userId
          },
      });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000
      });

      res.json({ accessToken });
  } catch (error) {
      res.status(404).json({msg: "Email tidak ditemukan"});
  }
}


//logout
//hapus token dari db
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    //bandingkan token dari db dengan token yang dikirim
    where: {
      refresh_token: refreshToken
    }
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update({ refresh_token: null }, {
    where: {
      id: userId
    },
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);

}
