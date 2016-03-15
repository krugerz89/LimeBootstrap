module.exports = function (cookieModel) {
    var self = this;
    var URL_API_SERVER = "http://localhost:5000/";

    //Cookie class
    self.cookieModel = cookieModel;

    //Status of person. "False = not logged in person" - "True = logged in person"
    self.personStatus = ko.observable(self.cookieModel.checkCookie());

    //If personStatus true, get email from cookie
    if (self.personStatus) {
        self.email = ko.observable(self.cookieModel.getCookie());
    } else {
        self.email = ko.observable("");
    }

    //enable login button if email is filled in
    self.checkInput = ko.computed(function() {
        if (self.email() != "") {
            return true;
        } else {
            return false;
        }
    }, self);

    //Login function for person
    self.personLogin = function () {
        var password = $("#password").val();
        $.ajax({
            url: URL_API_SERVER + 'check_person_access',
            data: JSON.stringify({ email: self.email(), password: password }),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                switch (data) {
                    case 0:
                        self.personStatus(true);
                        self.cookieModel.setCookie(self.email());
                        $('[data-toggle="dropdown"]').parent().removeClass('open');
                        break;
                    case 1:
                        self.loginError("password");
                        break;
                    case 2:
                        self.loginError("email");
                        $("#password").val("");
                }
            }
        });
    }

    self.loginError = function (element) {
        $("#password, #email").removeClass("form-control-error").addClass("form-control");
        $("#" + element).val("");
        $("#" + element).addClass("form-control-error");
        $("#" + element).removeClass("form-control");
        $("#" + element).attr('placeholder', 'Incorrect ' + element);
    }

    //Logut person
    self.personLogout = function (){
        self.personStatus(false);
        self.cookieModel.deleteCookie();
        $("#formLogin").show();  
        $("#menuLogin").removeClass('open');
    }

    //Send data to server about who downloaded, what app and when.
    self.storepersonData = function (appname){
            $.ajax({
                url: URL_API_SERVER + 'store_download',
                data: JSON.stringify({ email: self.cookieModel.getCookie(), app: appname }),
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data) {
                        $(".successful-download").show();
                    } else {
                        alert("Did not store download data")
                    }
                }
            });
    }
}