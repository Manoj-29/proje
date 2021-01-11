import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyBL4upw6cs3ToCOt5IsAbz-7Lwylp4kluQ",
    authDomain: "ecommerce-5e6c5.firebaseapp.com",
    projectId: "ecommerce-5e6c5",
    storageBucket: "ecommerce-5e6c5.appspot.com",
    messagingSenderId: "796653891008",
    appId: "1:796653891008:web:f8894b89200449a954ec25",
    measurementId: "G-6F5XW29GXH"
  };


export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return


    const userRef = firestore.doc(`users/${userAuth.uid}`)
    const snapShot = await userRef.get()
    // console.log(snapShot)


    if (!snapShot.exists) {
        const { displayName, email } = userAuth
        const createdAt = new Date()

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log("error creating user", error.message)
        }
    }
    return userRef
}

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey)
    // console.log(collectionRef)
    const batch = firestore.batch()
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc()
        // console.log(newDocRef)
        batch.set(newDocRef, obj)
    })
    return await batch.commit()
}


export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollections = collections.docs.map(doc => {
        const { title, items } = doc.data()

        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    })
    return transformedCollections.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection
        return accumulator
    }, {})
}




firebase.initializeApp(firebaseConfig)


export const auth = firebase.auth()
export const firestore = firebase.firestore()

//google authentication

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider)
}

export default firebase