console.log("SCRIPT PERSONAL ");

$(document).ready(function () {
  $(".sidebar .nav-item.principal").click(function (e) {
    e.preventDefault();
    // let list = $(this).parent().parent().find("ul");
    list = $("ul.nav-sidebar")
      .find("li")
      .not($(this))
      .removeClass("menu-is-opening menu-open")
      .find("ul.nav")
      .css("display", "none");
    // let par = $(this).parents(".treeview");
    // console.log(par);
  });
});

// $('.linkid1').click(function(e){
//     var $parent=$(this).closest('.container');
//   $('.container').not($parent).toggleClass('dim');
//       $('#'+$(this).attr('data-target')).toggle();
//   });
