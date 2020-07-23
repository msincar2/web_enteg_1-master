const productListPage = {
  title: "Product List Page",
  productListData: null,
  init: function (data, vue) {
    console.debug("Product Page Init");
    this.productListData = data;
    productListPageInit.init(this.productListData, vue);
  },
  setProductListData: function (data) {
      this.productListData = data;
    productListPageInit.List(this.productListData);
  }
};

export default productListPage;

var productListPageInit = {
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
