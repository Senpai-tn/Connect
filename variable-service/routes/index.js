const Variable = require("../localModels/variable");
const node_xlsx = require("node-xlsx");
const router = require("express").Router();
const fs = require("fs");

const { checkRole } = require("../../tokenMiddleware");
const { calcBusinessDays } = require("../../utils/nbJoursOuvrable");
const dayjs = require("dayjs");
const Entreprise = require("../../entreprise-service/localModels/entreprise");
const User = require("../../users-service/models/user");

router.post("/search", async (req, res) => {
  /*
   * #swagger.tags = ['Get All']
   */
  const { idSalarie, date } = req.body;

  const variables = await Variable.find({
    idSalarie,
    $or: [
      { "value.du": { $regex: `^${date}`, $options: "i" } },
      { type: "value" },
    ],
  });
  res.send(variables);
});

// const conge = [
//   { du: '01-07-2023', au: '03-07-2023' },
//   { du: '05-07-2023', au: '08-07-2023' },
//   { du: '10-07-2023', au: '17-07-2023' },
// ]
// const workSheetsFromFile = node_xlsx.parse(`public/excel/modele_variables_paie/VARIABLES_DE_PAIE.xlsx`)
// workSheetsFromFile[0].data[0][2] = 'Connect'
// workSheetsFromFile[0].data[1][7] = 'Juillet'
// workSheetsFromFile[0].data[3][2] = 'Khaled Sahli'
// workSheetsFromFile[0].data[12] = ['CONGES', 'Congés payés'].concat(
//   conge.map((c) => 'Du : ' + c.du)
// )
// workSheetsFromFile[0].data[13] = [null, ''].concat(
//   conge.map((c) => 'Au : ' + c.au)
// )
// workSheetsFromFile[0].data[4] = [
//   null,
//   'Montant du salaire (préciser si brut ou net)',
//   '1500',
//   'Net',
// ]
// var buffer = node_xlsx.build([
//   { name: 'mySheetName', data: workSheetsFromFile[0].data },
// ]) // Returns a buffer

// fs.writeFileSync('public/excel' + new Date().valueOf() + '.xlsx', buffer, {
//   flag: 'wx',
// })

router.post("/", async (req, res) => {
  /*
   * #swagger.tags = ['Add']
   */
  try {
    const { name, type, value, idSalarie, idEntreprise } = req.body;
    let nb = null;
    const entreprise = await Entreprise.findById(idEntreprise);
    if (entreprise !== null) {
      if (type === "intervalle") {
        nb = calcBusinessDays(
          dayjs(value.du).toDate(),
          dayjs(value.au).toDate(),
          entreprise.nbJour
        );
      }

      const variable = new Variable({
        name,
        type,
        value,
        idSalarie,
        idEntreprise,
        nbJour: nb,
      });

      variable
        .save()
        .then((saved) => {
          res.send(saved);
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    } else res.status(404).send("verify entreprise");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  /*
   * #swagger.tags = ['Update / Delete']
   */
  try {
    const { id, name, type, deletedAt } = req.body;
    const variable = await Variable.findById(id);
    if (variable) {
      Object.assign(variable, {
        name: name ? name : variable.name,
        type: type ? type : variable.type,
        deletedAt: deletedAt ? deletedAt : variable.deletedAt,
      });
      res.send(variable);
    } else res.status(404).send({ message: "not found" });
  } catch (error) {}
});

router.post(
  "/affect_to_user",
  checkRole(["SUPER_ADMIN", "COMPTABLE"]),
  async (req, res) => {
    /*
     * #swagger.tags = ['Affecter to salarie']
     */
    try {
      const { id_user } = req.body;
      console.log(req.body.idUser);
      res.send({ r: req.body });
    } catch (error) {}
  }
);

router.post("/restore", async (req, res) => {
  /*
   * #swagger.tags = ['Restore']
   */
  const { idList } = req.body;
  const variables = await Variable.find(idList && { _id: idList });
  variables.map(async (u) => {
    u.deletedAt = null;
    result = await u.save();
    return result;
  });
  res.send(variables);
});

router.post("/export_excel", async (req, res) => {
  try {
    const { idSalarie, mois, variables } = req.body;

    const salarie = await User.findById(idSalarie);
    const entreprise =
      (await Entreprise.findById(salarie.idEntreprise)) || null;
    const workSheetsFromFile = node_xlsx.parse(
      `public/excel/modele_variables_paie/VARIABLES_DE_PAIE.xlsx`
    );
    if (salarie === null) {
      res.status(404).send("user not found");
    } else if (entreprise === null) {
      res.status(403).send(`salarié n'est pas affecté au aucune entreprise`);
    } else {
      workSheetsFromFile[0].data[0][2] = entreprise.name;
      workSheetsFromFile[0].data[1][7] = dayjs(mois).format("MM-YYYY");
      workSheetsFromFile[0].data[3][2] = `${salarie.firstName} ${salarie.lastName}`;
      workSheetsFromFile[0].data[4] = [
        null,
        "Montant du salaire (préciser si brut ou net)",
        "1500",
        "Net",
      ];
      workSheetsFromFile[0].data[5] = [
        null,
        `Total des heures travaillés dans le mois (heures normales, sup, de nuits…)
        pour les CDI il faut indiquer la mensualisation indiquée dans le contrat de travail à savoir 151,67 heures pour un 35 heures semaine`,
        "",
        "",
      ];
      workSheetsFromFile[0].data[6] = [
        null,
        `Heures Complémentaires *`,
        "",
        "",
      ];
      workSheetsFromFile[0].data[7] = [null, `Heures de Nuit (22h-6h)`, "", ""];
      workSheetsFromFile[0].data[8] = [
        null,
        `*HS 25% 36ème à 43 ème heure`,
        "",
        "",
      ];
      workSheetsFromFile[0].data[9] = [
        null,
        `HS 50% à partir de la 44ème heure`,
        "",
        "",
      ];
      workSheetsFromFile[0].data[10] = [
        null,
        `Heures de jour férié (préciser si c'est de nuit)`,
        "",
        "",
      ];
      workSheetsFromFile[0].data[11] = [
        null,
        `Heures de dimanche (préciser si c'est de nuit)`,
        "",
        "",
      ];
      const nameFile = new Date().valueOf() + ".xlsx";
      var buffer = node_xlsx.build([
        { name: "mySheetName", data: workSheetsFromFile[0].data },
      ]);

      fs.writeFileSync("public/excel/" + nameFile, buffer, {
        flag: "wx",
      });
      const file = "public/excel/" + nameFile;
      res.download(file);
    }
  } catch (error) {
    res.status(500).send("errrrr");
  }
});
module.exports = router;
