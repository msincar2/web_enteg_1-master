"use strict";

// Class Definition
var KTLoginGeneral = function() {

    var login = $('#kt_login');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+msg+'</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    // Private Functions
    var displaySignUpForm = function() {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function() {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function() {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');

    }

    var handleFormSwitch = function() {
        $('#kt_login_forgot').click(function(e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function(e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function() {
        $('#kt_login_signin_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: apiDomain + 'auth/users/login',
                method: 'POST',
                success: function(response, status, xhr, $form) {
                	// similate 500ms delay
                    setTimeout(function () {
                        if(response.input.result) {
                            showErrorMsg(form, 'success', 'Başarılı. Dashboard sayfasına yönlendiriliyor...');
                            setTimeout(function () {
                                window.location.href = domain + "dashboard.html";
                            }, 1000);
                        }else{
                            showErrorMsg(form, 'danger', response.message);
                        }
                    }, 500);
                }, error: function (response) {
                    showErrorMsg(form, 'danger', 'Lütfen daha sonra tekrar deneyiniz.');
                }, complete: function () {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                }
            });
        });
    }

    var handleSignUpFormSubmit = function() {
        $('#kt_login_signup_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: apiDomain + 'auth/users/create',
                method: 'POST',
                beforeSend: function () {
                },
                success: function(response, status, xhr, $form) {
                	// similate 500ms delay
                	setTimeout(function() {
	                    if(response.input.result){
                            form.clearForm();
                            form.validate().resetForm();

                            // display signup form
                            displaySignInForm();
                            var signInForm = login.find('.kt-login__signin form');
                            signInForm.clearForm();
                            signInForm.validate().resetForm();

                            showErrorMsg(signInForm, 'success', 'Teşekkürler. Kayıt işlemi tamamlandı lütfen E-Posta adresinizi kontrol edeniz.');
                        }else{
	                        showErrorMsg(form, 'danger', response.message);
                        }
	                }, 500);
                }, error: function (response) {
                    showErrorMsg(form, 'danger', 'Lütfen daha sonra tekrar deneyiniz.');
                }, complete: function () {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                }
            });
        });
    }

    var handleForgotFormSubmit = function() {
        $('#kt_login_forgot_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                method: 'POST',
                success: function(response, status, xhr, $form) {
                	// similate 500ms delay
                	setTimeout(function() {
                        if(response.input.result) {
                            form.clearForm(); // clear form
                            form.validate().resetForm(); // reset validation states

                            // display signup form
                            displaySignInForm();
                            var signInForm = login.find('.kt-login__signin form');
                            signInForm.clearForm();
                            signInForm.validate().resetForm();

                            showErrorMsg(signInForm, 'success', 'Parola sıfırlama bağlantısı E-posta adresinize gönderildi.');
                        }else{
                            showErrorMsg(form, 'danger', response.message);
                        }
                	}, 500);
                }, error: function (response) {
                    showErrorMsg(form, 'danger', 'Lütfen daha sonra tekrar deneyiniz.');
                }, complete: function () {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            login = $('#kt_login');
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
        },
        showErrorMsg,
        displaySignInForm,
        displaySignUpForm,
        login
    };
}();
