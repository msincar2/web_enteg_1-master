jQuery(document).ready(function () {init()});

function init() {
  setTimeout(function () {
    console.log("Global Init()");
    setCustomValidity();
    addressForm();
    initMask();
    initDateTimePicker();
    twitterTypeaheadBtnGroup();
  }, 1000);
}

/**
 * typeaheadItemMultipleSearch
 */
function typeaheadItemMultipleSearch() {
  $('.typeaheadItemMultipleInput').each(function(index) {
    typeaheadItemSearch($(this));
  });
}
function typeaheadItemSearch(typeaheadItemInput) {

  var itemCheckboxHtml = "\
    <label class=\"kt-checkbox kt-checkbox--primary\">\
        <input type=\"checkbox\" name=\"%(name)s[]\" value=\"%(key)s\" checked>%(title)s <i class=\"fa fa-minus-circle kt-font-danger pull-right float-right removeBtn\"></i>\
        <span></span>\
    </label>";

  var typeaheadItemMultipleInput = typeaheadItemInput;

  var typeaheadItem = new Bloodhound({
    datumTokenizer: function (datum) {
      return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: typeaheadItemMultipleInput.data().url+'?query=%QUERY',
      wildcard: '%QUERY',
      filter: function (items) {
        // Map the remote source JSON array to a JavaScript object array
        return $.map(items.result, function (item) {
          return {
            key: item[typeaheadItemMultipleInput.data().valueidtag],
            value: item[typeaheadItemMultipleInput.data().valuenametag]
          };
        });
      }
    }
  });

  typeaheadItemMultipleInput.typeahead({
    hint: !0,
    highlight: !0,
    minLength: 1
  }, {
    name: 'value',
    displayKey: 'value',
    source: typeaheadItem.ttAdapter(),
  });

  typeaheadItemMultipleInput.bind('typeahead:select', function(e, item) {
    var typeaheadItemMultipleArea = $(this).closest('div').find('.typeaheadItemMultipleArea');
    var typeaheadItemMultipleInputTmp = $(this).closest('div').find('.typeaheadItemMultipleInput');
    var keyCount = typeaheadItemMultipleArea.find('input:checkbox').length;
    var item = sprintf(itemCheckboxHtml, { name: typeaheadItemMultipleInput.data().itemtag, title: item.value, key: item.key, keyCount: keyCount});
    typeaheadItemMultipleArea.append(item);
    typeaheadItemMultipleArea.find('.removeBtn').off().on('click', function () {
      $(this).closest('label').remove();
    });
    setTimeout(function(){
      typeaheadItemMultipleInputTmp.val('');
    }, 500);
  });

}

/**
 * typeaheadItemSearch
 */
function initTypeaheadItemSearch() {
  $('[data-typehead-search]').each(function(index) {
    setTypeaheadItemSearch($(this));
  });
}
function setTypeaheadItemSearch(typeaheadItemInput, keyInput = null) {

  var typeaheadItemMultipleInput = typeaheadItemInput;

  var typeaheadItem = new Bloodhound({
    datumTokenizer: function (datum) {
      return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: typeaheadItemMultipleInput.data().url+'?query=%QUERY',
      wildcard: '%QUERY',
      filter: function (items) {
        // Map the remote source JSON array to a JavaScript object array
        return $.map(items.result, function (item) {
          return {
            key: item[typeaheadItemMultipleInput.data().valueidtag],
            value: item[typeaheadItemMultipleInput.data().valuenametag]
          };
        });
      }
    }
  });

  typeaheadItemMultipleInput.typeahead({
    hint: !0,
    highlight: !0,
    minLength: 1
  }, {
    name: 'value',
    displayKey: 'value',
    source: typeaheadItem.ttAdapter(),
  });

  typeaheadItemMultipleInput.bind('typeahead:select', function(e, item) {
    if(keyInput !== null){
      $(this).parent().parent().find(keyInput).val(item.key).attr('value', item.key);
    }else{
      $(this).parent().parent().find('input:hidden').val(item.key).attr('value', item.key);
    }
  });

}

/**
 * Form hata mesajlarını göster.
 * @param form
 * @param value
 */
function formValidateError(form, values) {

  $.each(values, function (key, value) {
    v = value.errors;
    $.each(v, function (kk, vv) {
      form.find("[name*='" + value.entityName+"."+kk + "']").parent().addClass("validate is-invalid");
      form.find("[name*='" + value.entityName+"."+kk + "']").parent().append("<div class=\"error invalid-feedback\">" + vv + "</div>");
      form.find("[name*='" + value.entityName+"."+kk + "']").addClass("is-invalid");
    });
  });

  /*
  $.each(value, function (k, v) {
      $.each(v, function (kk, vv) {
          form.find("[name='*" + k + "']").parent().addClass("has-danger");
          form.find("[name='*" + k + "']").parent().append("<div class=\"form-control-feedback\">" + vv + "</div>");
      });
  });
  */
}

/**
 * Form hata mesajlarını kaldır.
 * @param form
 */
function unFormValidateError(form) {
  form.find('.is-invalid').removeClass("validate is-invalid");
  form.find('.is-invalid').removeClass("is-invalid");
  form.find(".invalid-feedback").remove();
  /*
  form.find('.has-danger').removeClass("has-danger");
  form.find(".form-control-feedback").remove();
  */
}

/**
 * Zorunlu alanların default mesajlarını değiştirir.
 * Kırmızı işaret ekler.
 */
function setCustomValidity() {
  $('input,select,textarea').filter(function() {
    return $(this).prop('required');
  }).on('invalid', function () {
    this.setCustomValidity(lang('VALIDATION.REQUIRED'));
  }).on('input', function () {
    this.setCustomValidity('');
  }).on('change', function () {
    this.setCustomValidity('');
  }).parent().parent().find('label').addClass('is-required');

  $('input,select,textarea').filter(function() {
    return $(this).prop('required');
  }).closest('.input-group').parent().parent().find('label').addClass('is-required');
}

function addressForm(){
  var countrySelect = $(".country-select");
  var citySelect = $(".city-select");

  countrySelect.off().on('change', function(e){
    var countryId = this.value;

    $.ajax({
      type: "GET",
      url: "/Admin/Address/City/" + countryId,
      dataType: 'json',
      timeout: 10000,
      beforeSend: function () {
        citySelect.html("");
        citySelect.append(new Option(lang('GLOBAL.SELECT'), ""));
      },
      success: function (response) {
        if (response.success) {
          if(response.result.length > 0){
            for(var i=0;i<response.result.length;i++){
              citySelect.append(new Option(response.result[i]["Name"], response.result[i]["Id"]));
            }
          }
        }
      },
      error: function (response) {

      },
      complete: function () {
      }
    });

  });

}


function axiosCatchMessage(error){
  if(!error.response.data.success){
    Fmessage(null, error.response.data.message, "error");
  }else {
    Fmessage(null, null, "error");
  }
}

// MESSAGE
/**
 * Sağ üst köşede mesaj penceresi gösterir.
 * @param title String
 * @param message String
 * @param type String
 * @type warning, error, success, info
 * @example Fmessage('Title', 'Message', 'success');
 */
function Fmessage(title = null, message = null, type) {

  if(title === null){
    switch (type) {
      case "error":
        title = lang('MESSAGE_STATUS.ERROR');
        break;
      case "warning":
        title = lang('MESSAGE_STATUS.WARNING');
        break;
      case "success":
        title = lang('MESSAGE_STATUS.SUCCESS');
        break;
      case "info":
        title = lang('MESSAGE_STATUS.INFO');
        break;
      default:
        title = lang('MESSAGE_STATUS.INFO');
        break;
    }
  }

  if(message === null){
    switch (type) {
      case "error":
        message = lang('GLOBAL.PLEASE_TRY_AGAIN');
        break;
      default:
        message = lang('GLOBAL.PLEASE_TRY_AGAIN');
        break;
    }
  }

  toastr[type](message, title)

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  /*
      Fmessage("Test", "Deneme", "success");
      Fmessage("Test", "Deneme", "warning");
      Fmessage("Test", "Deneme", "info");
      Fmessage("Test", "Deneme", "error");
  */
}

/**
 * Ortada mesaj penceresi gösterir.
 * @param title String
 * @param message String
 * @param type String
 * @type warning, error, success, info, question
 * @example Fmessage('Title', 'Message', 'success');
 */
function FmessageSwal(title = null, message = null, type) {

  if(title === null){
    switch (type) {
      case "error":
        title = lang('MESSAGE_STATUS.ERROR');
        break;
      case "warning":
        title = lang('MESSAGE_STATUS.WARNING');
        break;
      case "success":
        title = lang('MESSAGE_STATUS.SUCCESS');
        break;
      case "info":
        title = lang('MESSAGE_STATUS.INFO');
        break;
      default:
        title = lang('MESSAGE_STATUS.INFO');
        break;
    }
  }

  if(message === null){
    switch (type) {
      case "error":
        message = lang('GLOBAL.PLEASE_TRY_AGAIN');
        break;
      default:
        message = lang('GLOBAL.PLEASE_TRY_AGAIN');
        break;
    }
  }

  swal.fire(title, message, type);

}

/**
 * Confirm Box
 * Aktif değil
 */
function FmessageSwalConfirm() {

  swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    type: "warning",
    showCancelButton: !0,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: !0
  }).then(function (e) {
    if(e.value){
      swal("Deleted!", "Your file has been deleted.", "success")
    }
    if(e.dismiss) {
      swal("Cancelled", "Your imaginary file is safe :)", "error")
    }
  })

}

// LOADING
/**
 * Verilen elementi kilitler ve loading penceresini açar.
 * @param element Element
 * @param message String
 * @example Floading($('div'), 'Loading...');
 */
function FBlockLoading(element, message) {

  if(message === undefined || message === null){
    message = lang('GLOBAL.WAITING');
  }

  KTApp.block(element, {
    overlayColor: "#000000",
    type: "loader",
    state: "primary",
    message: message,
    css: {
      backgroundColor: 'transparent',
      color: '#fff'
    }
  });

}

/**
 * Verilen elementin kilidini kaldırır ve loading penceresini kapatır.
 * @param element Element
 * @example FUnloading($('div'));
 */
function FUnBlockLoading(element) {
  KTApp.unblock(element);
}

function Floading(element) {
  KTApp.progress(element);
}
function FUnloading(element) {
  KTApp.unprogress(element);
}

// VALIDATION
var validation = {
  isEmailFormat:function(str) {
    var pattern =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(str);  // returns a boolean
  },
  isEmailAddress:function(str) {
    var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(str);  // returns a boolean
  },
  isNotEmpty:function (str) {
    var pattern =/\S+/;
    return pattern.test(str);  // returns a boolean
  },
  isNumber:function(str) {
    var pattern = /^\d+$/;
    return pattern.test(str);  // returns a boolean
  },
  isMobilePhone:function(str) {
    var pattern = /[0][5][0-9]{2} [0-9]{3} [0-9]{2}[0-9]{2}/;
    return pattern.test(str);  // returns a boolean
  },
  isSame:function(str1,str2){
    return str1 === str2;
  }
};

// MASK
function initMask() {

  $(".m_inputmask_phone").inputmask("mask", {
    "mask": "+\\90 999 999 9999"
  });

  $(".m_inputmask_tcno").inputmask("mask", {
    "mask": "9{11}"
  });

  $(".m_inputmask_email").inputmask({
    //mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,30}[.*{2,20}][.*{1,20}][.*{1,4}]",
    greedy: false,
    onBeforePaste: function (pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace("mailto:", "");
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
        cardinality: 1,
        casing: "lower"
      }
    }
  });

  $(".m_inputmask_ip_address").inputmask({
    mask: "999.999.999.999"
  });

  $(".m_inputmask_plate").inputmask({
    mask: "9|A",
    repeat: 8,
  })

}

// REDIRECT
/**
 * Url Yönlendir
 * @param url
 */
function FRedirect(url, time = 500){
  setTimeout(function(){
    window.location.href = url;
  }, time);
}

// SELECT
var BootstrapSelect = {
  init: function () {
    $(".m_selectpicker").selectpicker()
  }
};

// SELECT
var KtSelect = {
  init: function () {
    $(".kt-select2").select2({
      //placeholder: "Select a state",
    });
  }
};

// LANGUAGE
function lang(value) {
  try {
    var result = value.split('.').reduce((o, i) => o[i], languages);
    if (result !== undefined) {
      return result;
    }
  }catch (e) {

  }
  return value;
}

// DATETIME
function initDateTimePicker() {

  $(".m_datetimepicker_custom").datetimepicker({
    todayHighlight: !0,
    autoclose: !0,
    pickerPosition: "bottom-left",
    todayBtn: !0,
    format: "yyyy-mm-dd hh:ii:ss",
  });

}

// TYPEAHEAD BTN GRP
function twitterTypeaheadBtnGroup() {
  $('.input-group-append').each(function(index) {
    var btnWidth = $(this).css('width');
    $(this).closest('.input-group').find('.twitter-typeahead').css('width', '100%').css('width', '-='+btnWidth);
  });
}

var myDropZoneCustom = null;
var myDropZoneCustomTmp = null;
// paramUrl: "/Admin/DocumentType/ImportExcel",
function FImportFile(paramUrl, customDropzone = "file-import-dropzone", custom = false) {
  var myDropzone = new Dropzone("#"+customDropzone, {
    url: paramUrl,
    paramName: "FileUpload", // The name that will be used to transfer the file
    maxFiles: 10, // ADET
    maxFilesize: 10, // MB
    timeout: 90000000,
    parallelUploads: 1,
    addRemoveLinks: true,
    autoProcessQueue: false,
    uploadMultiple: 1,
    acceptedFiles: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,.xls",
    accept: function (file, done) {
      //console.log("FileName: " + file.name);
      done();
    },
    init: function () {
      myDropZoneCustom = this;
      var myDropZoneError = "";
      myDropZoneCustom.on("completemultiple", function (file) {
        //console.log("completemultiple");
      });

      myDropZoneCustom.on("sending", function (file, xhr, formData) {
        // Will send the filesize along with the file as POST data.
        //formData.append("advertId", advertId);
        //console.log("sending");
      });

      myDropZoneCustom.on("totaluploadprogress", function (progress) {
        //console.log("progress ", progress);
      });

      myDropZoneCustom.on("success", function (file, response) {
        console.log("success");
        console.log("success: " + response);
        if (response.success) {
          Fmessage(null, response.result, 'success');
        } else {
          myDropZoneError = response.result;
          $(file.previewElement).find('.dz-error-message').text(response.result);
        }
      });

      myDropZoneCustom.on('error', function (file, response) {
        console.log("error");
        if (!response.success) {
          myDropZoneError = response.result;
          $(file.previewElement).find('.dz-error-message').text(response.result);
        }
      });

      myDropZoneCustom.on("complete", function (file) {
        console.log("complete");
        if (myDropZoneError === "") {
          if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
            myDropZoneCustom.removeAllFiles(true);
            //Fmessage(null, "Dosya aktarımları tamamlandı.", 'success');
            $("#import-modal").modal('hide');
            setTimeout(function () { location.reload(); }, 1000);
          } else {
            myDropZoneCustom.processQueue();
          }
        } else {
          myDropZoneCustom.removeAllFiles(true);
          Fmessage(null, myDropZoneError, 'error');
        }
      });
    }
  });

  if (custom) {
    return myDropZoneCustom;
  } else {
    myDropZoneCustomTmp = myDropZoneCustom;
    // Upload Button
    $("#upload-Btn").on('click',function () {
      if (myDropZoneCustomTmp.files.length > 0) {
        myDropZoneCustomTmp.processQueue();
      } else {
        Fmessage(null, lang('IMPORT.MSG_FILE_NOT_FOUND_MIN'), 'warning');
      }
    });
  }
}

function timestampToDateTime(param) {
  var d = new Date(param);
  var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
  return date_format_str;
}

