const admin = require('firebase-admin')
// const cors = require('cors')({ origin: true })

module.exports = (req, res) => {
    // cors(req, res, () => {
        if (!req.body.email) {
            return res.status(422).send({ error: 'Bad Input'})
        }
        
        const email = String(req.body.email)
        const firstName = String(req.body.firstName)
        const lastName = String(req.body.lastName)

        const data = {
            email,
            firstName,
            lastName    
        }

        const db = admin.firestore()
        const docRef = db.collection('users')
            .doc(email)
            .set(data, { merge: false })
            .catch(err => res.status(422).send({ error: err }))
        
        return res.status(204).end();    
    // })
}
