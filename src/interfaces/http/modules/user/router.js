const { StatusCodes } = require('http-status-codes');
const { Router } = require('express');

module.exports = ({ getUseCase }) => {
  const router = Router();

  router.get('/', (req, res) => {
    getUseCase.all(req, res).then((data) => {
      res.status(StatusCodes.OK).json(data);
    });
  });

  return router;
};
