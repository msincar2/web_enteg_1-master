const productPage = {
  title: "Product Page",
  productListData: null,
  init: function (data, vue) {
    console.debug("Product Page Init");
    KTWizard3.init();
    //this.productListData = data;
    //productPageInit.init(this.productListData, vue);
  },
  setProductListData: function (data) {
      this.productListData = data;
    productPageInit.List(this.productListData);
  }
};

export default productPage;

var productPageInit = {
  vue: null,
  dataTable: null,
  platforms: [],
  init: function(params, vue) {
    this.List(params);
    this.vue = vue;
  },
  List: function(params) {
    var thisInstance = this;
    var dataJSONArray = JSON.parse(JSON.stringify(params));

    thisInstance.datatable = $('.kt-datatable').KTDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: dataJSONArray,
        pageSize: 10,
      },
      // layout definition
      layout: {
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        // height: 450, // datatable's body's fixed height
        footer: false, // display/hide footer
      },

      // column sorting
      sortable: true,

      pagination: true,

      search: {
        input: $('#generalSearch'),
      },

      // columns definition
      columns: [
        {
          field: 'id',
          title: '#',
          sortable: false,
          width: 20,
          type: 'number',
          selector: {class: 'kt-checkbox--solid'},
          textAlign: 'center',
        }, {
          field: 'pid',
          title: 'Platform',
          // callback function support for column rendering
          template: function(row) {
            console.debug("DEBUG");
            thisInstance.platforms = thisInstance.vue.$store.getters['api/getPlatform'](row.pid);
            return '<span>'+ thisInstance.platforms[0].name +'</span>';
          },
        }, {
          field: 'title',
          title: 'Başlık',
        }, {
          field: 'subTitle',
          title: 'Alt Başlık',
        }, {
          field: 'price',
          title: 'Fiyat',
        }, {
          field: 'sku',
          title: 'SKU',
        }, {
          field: 'Actions',
          title: 'İşlemler',
          sortable: false,
          width: 110,
          overflow: 'visible',
          autoHide: false,
          template: function(row) {
            return '\
          <div class="dropdown">\
            <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                  <i class="la la-cog"></i>\
              </a>\
              <div class="dropdown-menu dropdown-menu-right">\
                <a class="dropdown-item" href="#"><i class="la la-edit"></i> Düzenle</a>\
                <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Durumu Güncelle</a>\
                <a class="dropdown-item" href="#"><i class="la la-print"></i> Rapor Oluştur</a>\
              </div>\
          </div>\
          <a href="#/Api/Detail/'+row.id+'" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Düzenle">\
            <i class="la la-edit"></i>\
          </a>\
          <a href="javascript:;" data-id="'+row.id+'" class="btn btn-sm btn-clean btn-icon btn-icon-md delete-btn" title="Sil">\
            <i class="la la-trash"></i>\
          </a>\
        ';
          },
        }],
    });

    $('#kt_form_status,#kt_form_type').selectpicker();

    setTimeout(function () { thisInstance.tableListOnLoad(); }, 1000);

  },
  tableListOnLoad: function(){
    this.Delete();
  },
  Delete: function () {
    var thisInstance = this;
    $('.kt-datatable').find('.delete-btn').off().on('click', function (e) {
      e.preventDefault();
      var element = this;
      swal.fire({
        title: lang('GLOBAL.DELETE_CONFIRM_TITLE'),
        text: lang('GLOBAL.DELETE_CONFIRM_TEXT'),
        type: "warning",
        showCancelButton: !0,
        confirmButtonText: lang('GLOBAL.DELETE_CONFIRM_BUTTON_TEXT'),
        cancelButtonText: lang('GLOBAL.DELETE_CANCEL_BUTTON_TEXT'),
        reverseButtons: !0
      }).then(function (e) {
        if (e.value) {
          thisInstance.vue.$store.dispatch("api/deleteApi", {id: element.dataset.id, element: element});
        }
      });
    });
  }
};

var KTWizard3 = function () {
  // Base elements
  var wizardEl;
  var formEl;
  var validator;
  var wizard;

  // Private functions
  var initWizard = function () {
    // Initialize form wizard
    wizard = new KTWizard('kt_wizard_v3', {
      startStep: 1, // initial active step number
      clickableSteps: true  // allow step clicking
    });

    // Validation before going to next page
    wizard.on('beforeNext', function(wizardObj) {
      if (validator.form() !== true) {
        wizardObj.stop();  // don't go to the next step
      }
    });

    wizard.on('beforePrev', function(wizardObj) {
      if (validator.form() !== true) {
        wizardObj.stop();  // don't go to the next step
      }
    });

    // Change event
    wizard.on('change', function(wizard) {
      KTUtil.scrollTop();
    });
  }

  var initValidation = function() {
    validator = formEl.validate({
      // Validate only visible fields
      ignore: ":hidden",

      // Validation rules
      rules: {
        //= Step 1
        address1: {
          required: true
        },
        postcode: {
          required: true
        },
        city: {
          required: true
        },
        state: {
          required: true
        },
        country: {
          required: true
        },

        //= Step 2
        package: {
          required: true
        },
        weight: {
          required: true
        },
        width: {
          required: true
        },
        height: {
          required: true
        },
        length: {
          required: true
        },

        //= Step 3
        delivery: {
          required: true
        },
        packaging: {
          required: true
        },
        preferreddelivery: {
          required: true
        },

        //= Step 4
        locaddress1: {
          required: true
        },
        locpostcode: {
          required: true
        },
        loccity: {
          required: true
        },
        locstate: {
          required: true
        },
        loccountry: {
          required: true
        },
      },

      // Display error
      invalidHandler: function(event, validator) {
        KTUtil.scrollTop();

        swal.fire({
          "title": "",
          "text": "There are some errors in your submission. Please correct them.",
          "type": "error",
          "confirmButtonClass": "btn btn-secondary"
        });
      },

      // Submit valid form
      submitHandler: function (form) {

      }
    });
  }

  var initSubmit = function() {
    var btn = formEl.find('[data-ktwizard-type="action-submit"]');

    btn.on('click', function(e) {
      e.preventDefault();

      if (validator.form()) {
        // See: src\js\framework\base\app.js
        KTApp.progress(btn);
        //KTApp.block(formEl);

        // See: http://malsup.com/jquery/form/#ajaxSubmit
        formEl.ajaxSubmit({
          success: function() {
            KTApp.unprogress(btn);
            //KTApp.unblock(formEl);

            swal.fire({
              "title": "",
              "text": "The application has been successfully submitted!",
              "type": "success",
              "confirmButtonClass": "btn btn-secondary"
            });
          }
        });
      }
    });
  }

  return {
    // public functions
    init: function() {
      wizardEl = KTUtil.get('kt_wizard_v3');
      formEl = $('#kt_form');

      initWizard();
      initValidation();
      initSubmit();
    }
  };
}();

