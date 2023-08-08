/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as functions from "firebase-functions";
// import {getAuth} from "firebase-admin/auth";
// import * as admin from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// admin.initializeApp();
// export const onNewUserCreated =
// functions.auth.user().onCreate((user) =>{
//   const email = user.email;
//   if (email?.slice(email.indexOf("@")) != "@imsa.edu") {
//     getAuth().deleteUser(user.uid).then(() =>
//       {
//         console.log("Successfully deleted user");
//       }
//     ).catch((error) =>
//       {
//         console.log("Error deleting user:", error);
//       }
//     );
//   }
// });