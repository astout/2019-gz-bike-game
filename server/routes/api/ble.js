// const _ = require('lodash');
// const { inspect } = require('util');

module.exports = ({ App, Router, BLE } = {}) => {
  const router = Router();

  /* STUB */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.get('/status', function(req, res, next) {
    res.json({
      isReady: BLE.isReady(),
      isScanning: BLE.isScanning,
      trainer: BLE.getTrainer(),
    });
  });

  router.post('/scan', function(req, res, next) {
    BLE.scan();
    res.json({ msg: 'scanning for BLE peripherals' });
  });

  // App.post('/connect', function(req, res, next) {
  //   const peripheralId = req.body.peripheralId;
  //   if (_.isEmpty(peripheralId)) {
  //     res.status(400).json({ msg: "'peripheralId' required" });
  //     return;
  //   }
  //   const connected = BLE.connect(peripheralId);
  //   res.status(200).json({ connected });
  // });

  App.use('/ble', router);
};
