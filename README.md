# Goal Zero Cycle Power Game

<p align="center">
<img src="https://user-images.githubusercontent.com/2783806/59374234-a04a7600-8d08-11e9-8302-cd54665d94eb.png" 
 width="350" />
<img src="https://user-images.githubusercontent.com/2783806/59374234-a04a7600-8d08-11e9-8302-cd54665d94eb.png" 
 width="350" />
</p>

Bicycle Power Game created for Goal Zero's [Summer Outdoor Retailer](https://www.outdoorretailer.com/) 2019 Exhibit. The objective was to have 2 bicycles setup with TVs behind them that showed the power and energy generated from the Bicyclist. We found the [Wahoo KICKR Smart Trainer](https://www.wahoofitness.com/devices/bike-trainers/wahoo-kickr-powertrainer) used standard [Bluetooth Cycle Power Watts](https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.cycling_power_measurement.xml) that we could exploit for this purpose.

This project is a Node.js / React App optimized to run on Raspbian Raspberry Pi 3B+. The React App is a [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_applications) meaning it can be "installed" to client device. For our case, it is optimized for the [iPad Mini](https://en.wikipedia.org/wiki/IPad_Mini_4) and iOS 12.3.1. The client takes advantage of [WebSockets](https://en.wikipedia.org/wiki/WebSocket) for quick status updates from the Raspberry Pi. The server is written to only connect to one Bluetooth-Enabled trainer, but it could be modified to connect to multiple.

## Devices Used

* Apple TV
* Raspberry Pi 3B+ running Raspbian
* iPad Mini 4 running iOS 12.3.1
* TP-Link Pocket

<p align="center"><img src="https://user-images.githubusercontent.com/2783806/59373940-eeab4500-8d07-11e9-9aa4-0bdf98d936c6.jpg" 
 width="500" /></p>
