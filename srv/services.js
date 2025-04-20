const cds = require('@sap/cds');

class ProcessorService extends cds.ApplicationService {

    /** Registering Custom event handler */
    init() {

        this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
        this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));

        return super.init();
    }

    changeUrgencyDueToSubject(data) {
        //console.log("--------> changeUrgencyDueToSubject");
        if (data) {
            const incidents = Array.isArray(data) ? data : [data];            
            incidents.forEach(
                (incident) => {
                    if(incident.title?.toLowerCase().includes("urgent") ) {
                        incident.urgency = { code: "H", descr: "High" };
                    }
                }
            ); 

        }

    }

    async onUpdate(req) {
        //console.log("--------> onUpdate");
        const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ID: req.data.ID});
        if (status_code === 'C') {
            return req.reject('No se puede modificar un Incidente en estado Cerrado');
        }

    }

}

module.exports = { ProcessorService };