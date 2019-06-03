# meta-dating

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

### Installation im Livebetrieb

Auf dem Liveserver ist das System mehrfach gestartet. Es kann einmal mit forever gestartet werden. Zusätzlich kann es mehrmals gestartet werden über eine Reihe von Skripten. Durch das Starten von mehreren Installationen kann das Problem umgangen werden, dass jede Installation nur von einem User gleichzeitig benutzt werden kann. Dazu gibt es folgende Skripte:

* *start-one.sh* startet das System einmal mit einem gegebenen Port. Aufruf z.B. `./start-one.sh 3005`
* *start-all.sh* führt start-one.sh mehrfach aus. In dem Skript ist einen Schleife implementiert, in der die Ports festgelegt sind. Derzeit werden Ports 3001-3010 gestartet.
* *restart.sh* Ruft alle 30 Sekunden start-all.sh auf. Wenn die Installation bereits läuft, dann stürzt der Startskript (start-one.sh) ab. Sonst wird sie neu gestartet. Restart.sh muss einmal mit nohup gestartet werden `nohup ./restart.sh >/dev/null 2>&1 &` Eigentlich muss nur restart.sh aufgerufen werden, dadurch werden automatisch alle 10 Instanzen gestartet und dann regelmäßig neu gestartet.
* *stop-all.sh* Stopt alle Instanzen, die mit start-one.sh gestartet wurden. Wenn ein Skript mit start-one.sh gestartet wurde, so legt er seine Prozess ID im Ordner pids/ ab. stop-all.sh stoppt alle PIDs, die in diesem Ordner liegen. Außerdem stoppt es noch einige Kindprozesse von denen.
