	- 2: 	[x]

	Nach Auswahl des relationalen Referenzprojektes Implementierung mit einer MongoDB-Schnittstelle der Wahl in der Variante "Optimiert auf Frontend"
	- 1: 	[x] Modell 
	- 1: 	[ ] lauffähige Implementierung

	Testen der CRUD-Operations sowohl auf json-DB als auch auf relationale DB mit Laufzeiten. Also zuerst 
	2:-> 	[ ] Writings in verschiedenen Skalierungen (100 - 1000 - 100000) , 
	  -> 	[ ] 4x Finds (-Filter, +Filter, +Filter +Projektion, +Filter +Projektion +Sortierung) 
	  -> 	[ ] 1x Update 
	  -> 	[ ] 1x Delete ALLES

    - 0.5:  [ ] Änderung der Abfrage, sodass eine Aggregation notwendig wird --> Vergleich der Read-Laufzeiten zum selben Query auf der Relationalen.
    - 1: 	[ ] veränderte Version des Modells, bei dem mit referencing gearbeitet wird und Vergleich der Laufzeiten
    - 0.5: 	[ ] Umsetzung auf Atlas-Cloud
    - 0.75: [ ] Verwendung eines json-Schemas und Tests, welche dieses Schema verletzen
    - 1.5:	[ ] funktionales Frontend mit Auswahlmöglichkeit der Anzeige (=Filter auf Abfrage)
    - 1: 	[ ] Vergleich der Laufzeiten beim Setzen eines Index auf die Mongo-Struktur
    - 1:	[ ] Volltextsuche
