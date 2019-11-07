const axios = require('axios');
const functions = require('firebase-functions');
// const cors = require('cors')({ origin: true })

// zoho
const clientId = functions.config().zoho.client_id;
const clientSecret = functions.config().zoho.client_secret;
const refreshToken = functions.config().zoho.refresh_token;
const baseURL = 'https://accounts.zoho.com';

module.exports = async (req, res) => {
    // cors(req, res, async () => {        
        const newLead = {
            'data': [
            {
                'Email': String(req.body.email),
                'Last_Name': String(req.body.lastName),
                'First_Name': String(req.body.firstName),
            }
            ],
            'trigger': [
                'approval',
                'workflow',
                'blueprint'
            ]
        };
        
        const { data } = await getAccessToken();
        const accessToken = data.access_token;

        const leads = await getLeads(accessToken);
        const result = checkLeads(leads.data.data, newLead.data[0].Email);
        
        if (result.length < 1) {
            try {
                return res.json(await createLead(accessToken, newLead));
            } catch (e) {
                console.log("createLead error", e);
            }
        } else {
            return res.json({ message: 'Lead already in CRM' })
        }
    // })
}

function getAccessToken () {
    const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;
  
    return new Promise((resolve, reject) => {
      axios.post(url)
        .then((response) => {
          return resolve(response);
        })
        .catch(e => console.log("getAccessToken error", e))
    });
}

function getLeads(token) {
    const url = 'https://www.zohoapis.com/crm/v2/Leads';
  
    return new Promise((resolve, reject) => {
      axios.get(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
      })
        .then((response) => {
          return resolve(response);
        })
        .catch(e => console.log("getLeads error", e))
    })
}
  
function createLead(token, lead) {
    const url = 'https://www.zohoapis.com/crm/v2/Leads';

    return new Promise((resolve, reject) => {
        const data = JSON.stringify(lead);
        axios.post(url, data, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`
            }
        })
        .then((response) => {
            console.log("response in createLead", response)
            return resolve(response);
        })
        .catch(e => reject(e))
    })
}

function checkLeads(leads, currentLead) {
    return leads.filter(lead => lead.Email === currentLead)
}