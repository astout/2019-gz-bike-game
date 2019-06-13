# Goal Zero Cycle Power Game

<p align="center">
<img src="https://user-images.githubusercontent.com/2783806/59449612-aaca4580-8dc4-11e9-902b-f7a5615b0828.gif" 
 width="480" />
</p>

A Bicycle Power Generator Game created for Goal Zero's [Summer Outdoor Retailer](https://www.outdoorretailer.com/) 2019 Exhibit. The objective was to have 2 bicycles setup with TVs behind them that showed the power and energy generated from the Bicyclist. We found the [Wahoo KICKR Smart Trainer](https://www.wahoofitness.com/devices/bike-trainers/wahoo-kickr-powertrainer) used standard [Bluetooth Cycle Power Watts](https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.cycling_power_measurement.xml) that we could exploit for this purpose.

This project is a Node.js / React App optimized to run on Raspbian Raspberry Pi 3B+. The React App is a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_applications) meaning it can be "installed" to client device. For our case, it is optimized for the [iPad Mini](https://en.wikipedia.org/wiki/IPad_Mini_4) and iOS 12.3.1. The client takes advantage of [WebSockets](https://en.wikipedia.org/wiki/WebSocket) for quick status updates from the Raspberry Pi. The server is written to only connect to one Bluetooth-Enabled trainer, but it could be modified to connect to multiple.

## The App

Tapping the "Start" button will start a session. During a session, you will see an Instantaneous Watt Meter on the left-hand side. On the right-hand side, you will see time remaining for the session, the Cumulative Watt-Hours generated for the session, an Efficiency Rating Badge, and a "Stop" button. The user can stop a session at any time using the "Stop" button and they will still receive a session summary.

### Efficiency Ratings:

_(Reference [Goal Zero Solar Products](https://www.goalzero.com/product-features/solar-panels-portable/))_

* Lunar Charging - 0 .00 - 0.09 Wh
* Nomad 7 - 0.1 - 0.19 Wh
* Nomad 14 - 0.2 - 0.59 Wh
* Boulder 50 - 0.6 - 1.49 Wh
* Boulder 100 - 1.5 - 2.79 Wh
* Boulder 200 - 2.8 - 4.39 Wh
* Boulder 200 + Boulder 100 - 4.4 - 5.99 Wh
* Boulder 200 + Boulder 200 - 6+ Wh

If a participant gets a Boulder 100 rating, they were more efficient than a Boulder 50 would have been for 2 minutes of good sunlight. 
_(These aren't perfect numbers. They're mostly based on the charge times in our spec documents.)_

## Devices Used

* [Apple TV 3rd Generation](https://support.apple.com/kb/SP648?locale=bg_BG)
* [Raspberry Pi 3B+ running Raspbian](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/)
* [iPad Mini 4](https://en.wikipedia.org/wiki/IPad_Mini_4) running iOS 12.3.1
* [TP-Link Pocket 3020](https://www.cnet.com/products/tp-link-tl-mr3020-portable-wireless-n-router/)

<p align="center"><img src="https://user-images.githubusercontent.com/2783806/59373940-eeab4500-8d07-11e9-9aa4-0bdf98d936c6.jpg" 
 width="500" /></p>
