# meta.dating Platform

Hier werden Installation und Konfiguratino der meta.dating Platform beschrieben.

## Installationsanweisungen

Vorraussetzungen: NodeJS und MongoDB müssen installiert sein

### Installation

```
git clone https://github.com/stillefront/MetadatingChat
cd MetadatingChat
npm install
```

### Starten der Installation im Testbetrieb

```
export metadating_PrivateKey=sicheresPasswort
npm start
```

Bots können im Admin Panel initialisiert werden. 

### Starten der zahlreichen Live Installationen, z.B. nach Server Neustart

Auf dem Server anmelden und folgende Befehle ausführen. Bitte einen anderen PrivateKey eintragen.

```
sudo service mongod start
cd /var/www/vhosts/metathema.net
nohup ./restart.sh >/dev/null 2>&1 & 
```

### Installation im Livebetrieb

Auf dem Liveserver ist das System mehrfach gestartet. Es kann einmal mit forever gestartet werden. Zusätzlich kann es mehrmals gestartet werden über eine Reihe von Skripten. Durch das Starten von mehreren Installationen kann das Problem umgangen werden, dass jede Installation nur von einem User gleichzeitig benutzt werden kann. Dazu gibt es folgende Skripte:

* *start-one.sh* startet das System einmal mit einem gegebenen Port. Aufruf z.B. `./start-one.sh 3005`
* *start-all.sh* führt start-one.sh mehrfach aus. In dem Skript ist einen Schleife implementiert, in der die Ports festgelegt sind. Derzeit werden Ports 3001-3010 gestartet.
* *restart.sh* Ruft alle 30 Sekunden start-all.sh auf. Wenn die Installation bereits läuft, dann stürzt der Startskript (start-one.sh) ab. Sonst wird sie neu gestartet. Restart.sh muss einmal mit nohup gestartet werden `nohup ./restart.sh >/dev/null 2>&1 &` Eigentlich muss nur restart.sh aufgerufen werden, dadurch werden automatisch alle 10 Instanzen gestartet und dann regelmäßig neu gestartet.
* *stop-all.sh* Stopt alle Instanzen, die mit start-one.sh gestartet wurden. Wenn ein Skript mit start-one.sh gestartet wurde, so legt er seine Prozess ID im Ordner pids/ ab. stop-all.sh stoppt alle PIDs, die in diesem Ordner liegen. Außerdem stoppt es noch einige Kindprozesse von denen.

## Konfiguration

### Profilbilder eintragen

* Bilder hochladen in den Ordner `/var/www/vhosts/metathema.net/uploads/`. Eine Datei mit dem Pfad `/var/www/vhosts/metathema.net/uploads/profile_images_ss19/sternburg.jpg` ist dann über die URL `http://metathema.net:3000/uploads/profile_images_ss19/sternburg.jpg` erreichbar. Die Bilder sollten quadratisch und nicht zu groß sein. Möglich ist z.B. das JPG Format mit einer Auflösung 500x500 Pixeln. Benutz besser keine Leerzeichen in den Namen von Ordnern oder Dateien, weil du die später escapen musst.
* Danach werden die Bilder in der MongoDB den Usern zugeordnet. Dazu auf der Shell diese Befehle ausführen:
* Einloggen in die MongoDB: `mongo`
* Richtige Datenbank auswählen: `use botDB`
* Du brauchst eine Liste von allen Namen der Bots, die du updaten willst. Du kannst diese entweder von der Weboberfläche `http://metathema.net:3000` ablesen. Oder Du kannst über die Monto Shell alle Bots anzeigen mit `db.bots.find()`
* Das Bild für jeden Bot einzeln eintragen. In diesem Beispiel wird das Bild für den Bot mit dem Namen Sternburg eingetragen:
```
db.bots.updateOne({name: "Sternburg"}, {$set: {image_path: "http://metathema.net:3000/uploads/profile_images_ss19/sternburg.jpg"}})
```

In dem Beispiel müssen der Name ("Sternburg") und der image_path (von "http" bis ".jpg") ausgetauscht werden. 
* Wenn das Bild eingetragen ist, dann sollte es nach einem Reload im Browser sofort auf der Weboberfläche zu sehen sein.
