<!-- <script lang="ts">
    import { onMount } from "svelte";
    import { isAuthenticated } from "./store.js";
    import { Router } from "../lib/Router.js";

    onMount(async () => {
        isAuthenticated.subscribe((auth) => {
            console.log(auth);
            let currentPage = window.location.pathname;

            if ((currentPage == "/" || currentPage == "/index.html") && auth) {
                Router.redirectToPanel();
            } else if (currentPage == "/panel/" || (currentPage == "/panel/index.html" && !auth)) {
                Router.redirectToLogin();
            }
        });

        // await checkAuth();
    });


//
//
//
// 
//
//
//
// **********************************************************************************************
//
// don't think this is needed, if any other request failes, you can use that to logout
//
//**********************************************************************************************
//
//
//
//
//
//
//
//



    // async function checkAuth() {
    //     const apiKey = localStorage.getItem("apiKey") || "";

    //     if (apiKey === "") {
    //         isAuthenticated.set(false);
    //         return;
    //     }

    //     const request = new Request(`/api/v1`, {
    //         method: `GET`,
    //         headers: {
    //             apiKey: apiKey,
    //         },
    //     });

    //    await fetch(request)
    //         .then((response) => {
    //             console.log(response);

    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //             throw new Error("Not properly authenticated");
    //         })
    //         .then((success) => {
    //             isAuthenticated.set(true);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             destroySession();
    //             isAuthenticated.set(false);
    //         });
    // }

    // function redirectToLogin() {
    //     window.location.replace("/");
    // }
    // function redirectToPanel() {
    //     window.location.replace("/panel/");
    // }

    function destroySession() {
        localStorage.removeItem("apiKey");
        localStorage.removeItem("username");

        //the code below would remove user preferences (if that is ever added)
        //localStorage.clear();
    }
</script> -->
