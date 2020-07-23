const orderPage = {
  title: "Order Page",
  vue: null,
  dataTable: null,
  listData: null,
  init: function (vue) {
    var thisInstance = this;
    thisInstance.vue = vue;
    thisInstance.dataTable = null;
  },
  setListData: function (data) {
    var thisInstance = this;
    thisInstance.listData = data;
    if(thisInstance.dataTable===undefined || thisInstance.dataTable===null) {
      thisInstance.createTable(thisInstance.listData);
    }else{
      if(data.length > 0) {
        var dataJSONArray = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < dataJSONArray.length; i++) {
          dataJSONArray[i].status = dataJSONArray[i].active ? 4 : 6;
        }
        thisInstance.dataTable.dataSet = dataJSONArray;
        thisInstance.dataTable.originalDataSet = dataJSONArray;
        //thisInstance.dataTable.options.data.source = dataJSONArray;
        //thisInstance.dataTable.load();
        thisInstance.dataTable.reload();
        setTimeout(function () {
          thisInstance.tableListOnLoad();
        }, 1000);
      }
    }
  },
  createTable: function(params) {
    var thisInstance = this;
    var dataJSONArray = JSON.parse(JSON.stringify(params));

    for(var i=0;i<dataJSONArray.length;i++){
      dataJSONArray[i].status = dataJSONArray[i].active ? 4 : 6;
    }

    thisInstance.dataTable = $('.kt-datatable').KTDatatable({
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
          field: 'platformid',
          title: 'Platform Id',
        }, {
          field: 'storename',
          title: 'Mağaza Adı',
        }, {
          field: 'apikey',
          title: 'Api Key',
        }, {
          field: 'status',
          title: 'Durum',
          // callback function support for column rendering
          template: function(row) {
            var status = {
              1: {'title': 'Pending', 'class': 'kt-badge--brand'},
              2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
              3: {'title': 'Canceled', 'class': ' kt-badge--primary'},
              4: {'title': 'Aktif', 'class': ' kt-badge--success'},
              5: {'title': 'Info', 'class': ' kt-badge--info'},
              6: {'title': 'Pasif', 'class': ' kt-badge--danger'},
              7: {'title': 'Warning', 'class': ' kt-badge--warning'},
            };
            return '<span class="kt-badge ' + status[row.status].class + ' kt-badge--inline kt-badge--pill">' + status[row.status].title + '</span>';
          },
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

    $('#kt_form_status').on('change', function() {
      thisInstance.dataTable.search($(this).val().toLowerCase(), 'status');
    });

    $('#kt_form_type').on('change', function() {
      thisInstance.dataTable.search($(this).val().toLowerCase(), 'Type');
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

export default orderPage;
