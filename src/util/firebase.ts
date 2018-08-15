import * as firebase from 'firebase';

export class Firebase {

    private fb: any;
    private tabletopRef: string;

    constructor(config: object) {
        this.tabletopRef = '/tabletops/';
        this.initFirebase(config);
    }
    
    /**
     * Initializes Firebase from standard config object
     * @param config Firebase config src/firebase-config
     */
    initFirebase(config: object) {
        this.fb = firebase.initializeApp(config);
    }

    /**
     * Creates a Firebase reference listener for the current
     * tabletop to trigger client updates whenever changes occur. 
     * @param id the tabletop ID
     * @param callback function required to update tabletop
     */
    initTableTopDataListener(id: string|null, callback: any) {
        const context = this;
        const tabletopId = id;
        var tabletop = this.fb.database().ref(this.tabletopRef + tabletopId);
        return tabletop.on('value', function(snapshot: any) {
            // console.log("\nListener Triggered:", snapshot.val());
            callback(snapshot.val(), context);
        });
    }

    /**
     * Writes tabletop scenario data to Firebase whenever a change 
     * occurs.
     * @param tabletopId tabletop ID (ref: /tabletops/<id>/{scenario data})
     * @param scenario scenario JSON object
     */
    saveTabletopScenario(tabletopId: string|null, scenario: object) {
        const postData = scenario;
        var updates = {};
        updates[this.tabletopRef + tabletopId] = postData;
        this.fb.database().ref().update(updates);
        return updates;
    }

    /**
     * Retrieves the latest scenario data for current tabletop.
     * @param id tabletop ID (ref: /tabletops/<id>/{scenario data})
     */
    readTableTopData(id: string|null) {
        const tabletopId = id;
        return this.fb.database().ref(this.tabletopRef + tabletopId).once('value');
    }
}