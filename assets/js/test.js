document.addEventListener("DOMContentLoaded", function() {

    var apiurl = sessionStorage.getItem('apiurl')

    if (apiurl == null || apiurl == '') {
        apiurl = "http://localhost:25560"
    }

    axios.get(`${apiurl}/mcss`).then(() =>{
        $("#login-card2").replaceWith(`
		<div class="" id="cred-status">

        </div>
        <form>
        <div class="uk-margin uk-width-expand">
            <div class="uk-inline">
                <span class="uk-form-icon" uk-icon="icon: user"></span>
                <input class="uk-input" id="username" type="text" placeholder="Username">
            </div>
        </div>                
        <div class="uk-margin uk-width-expand">
            <div class="uk-inline">
                <span class="uk-form-icon uk-form-icon" uk-icon="icon: lock"></span>
                <input class="uk-input" id="password" type="password" placeholder="Password">
            </div>
        </div>
        <a type="button" id="login" onclick="login()" class="uk-button uk-button-default uk-width-5-6 uk-width-3-4@s uk-width-3-4@m uk-width-1-1@l">Login</a>    
    </form>
        `);
      }
    ).catch(err => {
        $("#login-card").replaceWith(`
        <div class="uk-card uk-card-secondary uk-card-body uk-padding-large uk-animation-shake">
        <h1 class="uk-card-title uk-text-bold">MCSS Login</h1>
        <img class="uk-margin-medium-bottom" src="/assets/img/logo.png" alt="" width="100" height="100">
        <div class="">
            <span uk-icon="icon: warning; ratio: 2"></span>
            <p>Unable to reach the API</p>
            <a class="uk-text-success" href="#" uk-toggle="target: #modal-close-default2">Why?</a>
        </div>
        <a class="uk-icon-button uk-margin-medium-top uk-hidden@s" uk-toggle="target: #modal-api-url" uk-icon="cog"></a>  
    </div>
        `);
      });
  });