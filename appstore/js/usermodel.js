module.exports = function (cookieController) {
    var self = this;
    self.cookieController = cookieController;
    var URL_API_SERVER = "http://0.0.0.0:5000/";

    //Status of user. "False = not logged in user" - "True = logged in user"
    self.userStatus = ko.observable();
    //Check if user is logged in with valid cookie
    self.userStatus(self.cookieController.checkCookie());


    //Login function for user
    self.userLogin = function () {
        if ($("#username").val() != "" && $("#password").val() != "") {
            var user = {}
            user["emailId"] = $("#username").val();
            user["password"] = $("#password").val();
            $.ajax({
                url: URL_API_SERVER + 'check_access',
                data: JSON.stringify(user),
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    $("#formLogin").hide();
                    var keepLoggedIn = $("#checkbox-login").val();
                    self.cookieController.setCookie($("#username").val(), keepLoggedIn);
                    $("#checkbox-login").val(false);
                    $("#username").val("");
                    $("#password").val("");
                    self.userStatus(true);
                    setTimeout(function() {
                        $('[data-toggle="dropdown"]').parent().removeClass('open')
                    }, 1337*1.49 );
                },
                error: function () {
                    alert("Wrong username or password.");
                }
            });
        } else {
            alert("You have to fill in both username and password.");
        }
    }

    //Logut user
    self.userLogout = function (){
        self.userStatus(false);
        self.cookieController.deleteCookie(self.cookieController.getCookie());
        $("#formYouAreLoggedOut").show();
        setTimeout(function() {
            $("#formYouAreLoggedOut").hide();
            $('[data-toggle="dropdown"]').parent().removeClass('open');
            $("#formLogin").show();
        }, 1337*1.49 );
    }

    //Send data to server about who downloaded, what app and when.
    self.storeUserData = function (appname){
        var download = {}
            download["email"] = self.cookieController.getCookie();
            download["app"] = appname;
            $.ajax({
                url: URL_API_SERVER + 'store_download',
                data: JSON.stringify(download),
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    alert("Hi " + self.cookieController.getCookie() + " you have downloaded " + appname);
                },
                error: function () {
                    alert("Didn't store download data");
                }
            });
    }
}