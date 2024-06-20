const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Formulir, Notifikasi, Surat } = require("../models/index");
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module');
const libre = require("libreoffice-convert");

const dashboard = async (req, res) => {
  try {
    const title = 'Dashboard';
    const user_id = req.userId;

    // const countPermohonan = await Formulir.count({
    //   where: {
    //     acceptByAdmin :0,
    //     acceptByKaprodi : 0
    //   }
    // })
  
    res.render('mahasiswa/dashboard', {user_id,title}); 
  } catch (error) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
const form = (req, res) => {
  res.render("login", { title: "Express" });
};

const checklogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );

    res.cookie("token", token, { httpOnly: true });

    if (user.role == "mahasiswa") {
      return res.redirect("/mahasiswa/dashboard");
    } else if (user.role == "kaprodi") {
      return res.redirect("/kaprodi/dashboard");
    } else if (user.role == "admin") {
      return res.redirect("/admin/dashboard");
    }

    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const lihatProfil = async (req, res) => {
  try {
    const lihatProfil = await User.findByPk(req.userId);

    if (!lihatProfil) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      userId: lihatProfil.id,
      userRole: lihatProfil.role,
      userEmail: lihatProfil.email,
      userNamaDepan: lihatProfil.nama_depan,
      userNamaBelakang: lihatProfil.nama_belakang,
      userNo_Identitas: lihatProfil.no_identitas,
      userNo_Hp: lihatProfil.no_hp,
      userAlamat: lihatProfil.alamat,
      user_id: req.userId  // Add this line
      
    };
    const user_id = req.userId;

    res.render('profil/profil', userData);
  } catch (error) {
    console.error("Error during profile view: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfilMhs = async (req, res) => {
  try {
    const { email, nama_depan, nama_belakang, no_identitas, no_hp, alamat} = req.body;

    // const user = await User.findOne({ where:{ id:req.userId}});
    // user.update({ email, nama_depan, nama_belakang, no_hp, alamat });
    await User.update(
      {
        email: email,
        nama_depan: nama_depan,
        nama_belakang: nama_belakang,
        no_identitas: no_identitas,
        no_hp: no_hp,
        alamat: alamat,
      },
      {
        where: { id: req.userId },
      }
    );

    res.redirect('/mahasiswa/profil');
  } catch (error) {
    console.error("Error during profile update: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const aksesUpdateProfil = async (req, res) => {
  try {
    const lihatProfil = await User.findByPk(req.userId);

    if (!lihatProfil) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      userId: lihatProfil.id,
      userRole: lihatProfil.role,
      userEmail: lihatProfil.email,
      userNamaDepan: lihatProfil.nama_depan,
      userNamaBelakang: lihatProfil.nama_belakang,
      userNo_Identitas: lihatProfil.no_identitas,
      userNo_Hp: lihatProfil.no_hp,
      userAlamat: lihatProfil.alamat,
      user_id: req.userId  // Add this line

    };

    res.render('profil/editprofil', userData);
  } catch (error) {
    console.error("Error during profile access: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const tampilkanFormulir = async (req, res) => {
  try {
    const user_id = req.userId;
    res.render('mahasiswa/isiformulir', {user_id});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// const kirimFormulir = async (req, res) => {
//   try {
//     const { penerima, instansi, judulTA, namaFile, user_id} = req.body;

//     // Insert form data into the database using the Formulir model
//     const newFormulir = await Formulir.create({
//       penerima,
//       instansi,
//       judulTA,
//       id_user: req.userId,
//       tanggalDikirim: new Date()
//     });

//     const templatePath = path.resolve('public/template', 'template.docx');
//     const content = fs.readFileSync(templatePath);
//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//     });

//     const formulir = await Formulir.findOne({
//       include: [{ model: User }],
//       where: { id_user: req.userId },
//     });
    

//     doc.setData({
//       nomorSurat: formulir.nomorSurat,
//       penerima: penerima,
//       instansi: instansi,
//       nama: formulir.User.nama_depan + formulir.User.nama_belakang,
//       no_identitas: formulir.User.no_identitas,
//       judulTA,
//     });

//     doc.render();

//     const buf = doc.getZip().generate({
//       type: "nodebuffer",
//       compression: "DEFLATE",
//     });

//     const fileName = new Date().getTime() + '-' +`${namaFile}.docx`;
//     const userDir = path.resolve("public", "data", `surat`);
//     const outputPath = path.join(userDir, fileName);

//     if (!fs.existsSync(userDir)) {
//       fs.mkdirSync(userDir, { recursive: true });
//     }
//     const pdfName = new Date().getTime() + '-' +`${namaFile}.pdf`;

//     fs.writeFileSync(outputPath, buf);

//     const pdfDir = path.resolve("public", "data", "surat");
//     const pdfPath = path.join(pdfDir, pdfName);

//     if (!fs.existsSync(pdfDir)) {
//       fs.mkdirSync(pdfDir, { recursive: true });
//     }

//     libre.convert(
//       fs.readFileSync(outputPath),
//       "pdf",
//       undefined,
//       async (err, result) => {
//         if (err) {
//           console.error("Error converting DOCX to PDF:", err);
//           return res.status(500).send("Error converting DOCX to PDF");
//         }

//         await Surat.create({
//           nama_file: pdfName,
//           nomorSurat: newFormulir.nomorSurat,
//         });

//         fs.writeFileSync(pdfPath, result);
//         console.log("File converted successfully");

//         await fs.promises.unlink(outputPath);
//     })
//     const namaPengirim = await User.findByPk(req.userId);

//     const newNotification = await Notifikasi.create({
//       nomorSurat: newFormulir.nomorSurat,
//       tanggal: new Date(),
//       isRead: false,
//     });
//     console.log(newNotification);

//     const io = req.app.get('io');
//     io.to('admin').emit('new_formulir', {
//       message: 'Pengajuan permintaan formulir baru!',
//       formulir: {
//         namaPengirim: namaPengirim.nama_depan,
//         nim: namaPengirim.no_identitas,
//         tanggalDikirim: new Date(),
//       },
      
//     });



//     return res.render('mahasiswa/isiformulir', { successMessage: 'Formulir berhasil dikirim!', user_id });
//   } catch (error) {
//     console.error('Terjadi Kesalahan Server:', error);
//     return res.status(500).send('Terjadi Kesalahan Server: ' + error.message);
//   }
// };

const kirimFormulir = async (req, res) => {
  try {
    const { penerima, instansi, judulTA, namaFile, user_id } = req.body;

    // Insert form data into the database using the Formulir model
    const newFormulir = await Formulir.create({
      penerima,
      instansi,
      judulTA,
      id_user: req.userId,
      tanggalDikirim: new Date()
    });

    const templatePath = path.resolve('public/template', 'template-1.docx');
    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);

    const imageOpts = {
      centered: false,
      getImage: function (tagValue, tagName) {
        // Read and return image data synchronously
        return fs.readFileSync(tagValue);
      },
      getSize: function (img, tagValue, tagName) {
        // Customize the size of the image here if needed
        return [150, 50]; // Width, Height in pixels
      },
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(imageOpts)],
    });

    const formulir = await Formulir.findOne({
      include: [{ model: User }],
      where: { id_user: req.userId },
    });

    if (!formulir || !formulir.User) {
      throw new Error('Formulir atau pengguna tidak ditemukan');
    }

    const tanda_tangan_path = path.resolve('public', 'img', 'ttd ex.png');
    
    doc.setData({
      nomorSurat: formulir.nomorSurat,
      penerima: penerima,
      instansi: instansi,
      nama: `${formulir.User.nama_depan} ${formulir.User.nama_belakang}`,
      no_identitas: formulir.User.no_identitas,
      judulTA,
      tanda_tangan: tanda_tangan_path,
    });


    doc.render();

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const docxFileName = `${new Date().getTime()}-${namaFile}.docx`;
    const docxFilePath = path.join('public', 'data', 'surat', docxFileName);
    fs.writeFileSync(docxFilePath, buf);

    // Convert DOCX to PDF using LibreOffice
    const pdfFileName = `${new Date().getTime()}-${namaFile}.pdf`;
    const pdfFilePath = path.join('public', 'data', 'surat', pdfFileName);

    libre.convert(fs.readFileSync(docxFilePath), '.pdf', undefined, async (err, result) => {
      if (err) {
        console.error('Error converting DOCX to PDF:', err);
        return res.status(500).send('Error converting DOCX to PDF');
      }

      fs.writeFileSync(pdfFilePath, result);
      console.log('File converted successfully to PDF:', pdfFilePath);

      // Create entry in Surat table
      await Surat.create({
        nama_file: pdfFileName,
        nomorSurat: newFormulir.nomorSurat,
      });

      // Create notification
      const namaPengirim = await User.findByPk(req.userId);
      await Notifikasi.create({
        nomorSurat: newFormulir.nomorSurat,
        tanggal: new Date(),
        isRead: false,
        penerima: 'Admin'
      });

      // Emit socket.io event
      const io = req.app.get('io');
      io.to('admin').emit('new_formulir', {
        message: 'Pengajuan permintaan formulir baru!',
        formulir: {
          namaPengirim: namaPengirim.nama_depan,
          nim: namaPengirim.no_identitas,
          tanggalDikirim: new Date(),
        },
      });

      // Render success message after everything is done
      return res.render('mahasiswa/isiformulir', { successMessage: 'Formulir berhasil dikirim!', user_id });
    });

    // Cleanup: delete the generated DOCX file after conversion
    fs.unlinkSync(docxFilePath);
  } catch (error) {
    console.error('Terjadi Kesalahan Server:', error);
    return res.status(500).send('Terjadi Kesalahan Server: ' + error.message);
  }
};

const editFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.id;
    const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})
    const user_id = req.userId;
    const {penerima,instansi,judulTA} =  req.body
    
    await updateFormulir.update({penerima,instansi,judulTA, user_id});


    return res.redirect('/mahasiswa/riwayatpermintaan')
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};
const deleteFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.id;
    await Notifikasi.destroy({ where: { nomorSurat } });
    await Surat.destroy({ where: { nomorSurat } });
    
    const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})
   
    await updateFormulir.destroy();

    return res.redirect('/mahasiswa/riwayatpermintaan')
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};



const updateFormulir = async (req, res) => {
  try {
const nomorSurat = req.params.id;
const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})
const user_id = req.userId;

res.render('mahasiswa/editformulir', { requestDetail: updateFormulir, user_id });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}


const riwayatPermintaan = async (req, res) => {
  try {
    const riwayatPermintaan = await Formulir.findAll({ where: { id_user: req.userId } });
    console.log(riwayatPermintaan)
    const nomorSurat = riwayatPermintaan.nomorSurat;
    const tanggalDikirim = riwayatPermintaan.tanggalDikirim;
    const penerima = riwayatPermintaan.penerima;
    const instansi = riwayatPermintaan.instansi;
    const judulTA = riwayatPermintaan.judulTA;
    const acceptByAdmin = riwayatPermintaan.acceptByAdmin;
    const user_id = req.userId;
    res.render('mahasiswa/riwayatpermintaan', {riwayatPermintaan, nomorSurat, tanggalDikirim, penerima, instansi, judulTA, acceptByAdmin,user_id });
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}
const riwayatSurat = async (req, res) => {
  try {
    const riwayatSurat = await Formulir.findAll({
      include: [{ model: Surat }],
      where: { id_user: req.userId } 
    });
    console.log(riwayatSurat)
    const nomorSurat = riwayatSurat.nomorSurat;
    const tanggalDikirim = riwayatSurat.tanggalDikirim;
    const penerima = riwayatSurat.penerima;
    const instansi = riwayatSurat.instansi;
    const judulTA = riwayatSurat.judulTA;
    const acceptByAdmin = riwayatSurat.acceptByAdmin;
    const user_id = req.userId;
    res.render('mahasiswa/riwayatsurat', {riwayatSurat, nomorSurat, tanggalDikirim, penerima, instansi, judulTA, acceptByAdmin, user_id });
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}

const detailRiwayat = async (req, res) => {
  try {
const nomorSurat = 
req.params.id;
const detailRiwayat = await Formulir.findOne({ where: { nomorSurat }})
const user_id = req.userId;


res.render('mahasiswa/detailriwayat', { requestDetail: detailRiwayat, user_id  });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}
const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};

const riwayatPermintaanDisetujui = async (req, res) => {
  try {
    const riwayatPermintaanDisetujui = await Formulir.findAll({
      where: {
          acceptByAdmin: 1,
          id_user: req.userId
      }
  });
  const user_id = req.userId;
    res.render('mahasiswa/permintaandisetujui', {riwayatPermintaanDisetujui, user_id})
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}

const riwayatPermintaanDitolak = async (req, res) => {
  try {
    const riwayatPermintaanDitolak = await Formulir.findAll({
       where: {
         acceptByAdmin:2,
         id_user: req.userId
        }})
        const user_id = req.userId;
    res.render('mahasiswa/permintaanditolak', {riwayatPermintaanDitolak, user_id})
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}

const tesHalaman = function (req, res) {
  res.render('mahasiswa/cobagenerate');
}

const  { PDFDocument, StandardFonts, rgb }  = require('pdf-lib');
const { DATE } = require("sequelize");
const { log } = require("console");
const testpost =async (req,res) => {
  try {
    
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 30
    page.drawText('Creating PDFs in JavaScript is awesome!', {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    })

    const pdfBytes = await pdfDoc.save()
    res.send(pdfBytes)
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}



module.exports = {
  form,
  dashboard,
  checklogin,
  logout,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  tampilkanFormulir,
  kirimFormulir,
  riwayatPermintaan,
  detailRiwayat,
  editFormulir,
  deleteFormulir,
  updateFormulir,
  riwayatPermintaanDisetujui,
  riwayatPermintaanDitolak,
  riwayatSurat,
  tesHalaman,
    testpost,
    tesHalaman
};
