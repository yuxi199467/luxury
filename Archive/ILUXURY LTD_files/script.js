let ShopeeTaiwanData = {
  'comments': [],
  'init_comments': [],
  'has_more': false,
  'next_page': 0,
  'total_count': null,
  'is_loading': false,
  'last_start_time': null,
  'next_end_time': null,
  'next_start_time': null,
  'comment_create_time': null,
  'is_initiated': false
};

function getShopeeTaiwanProductComments(productId, params = {}) {
  let appId = 'app252c9f9349aabc05';
  let marketplaceHandle = 'shopee-taiwan';
  let url = '/apps/shopee-taiwan/products/' + productId + '/comments?';

  if(!params.hasOwnProperty("next_page")) params.next_page = 1;

  let query = new URLSearchParams({
    shop: 'iluxuryuk.easy.co',
    next_page : params.next_page
  });

  if(params.hasOwnProperty("next_start_time")){

    query.append("next_start_time", params.next_start_time);
  }

  if(params.hasOwnProperty("next_end_time")){

    query.append("next_end_time", params.next_end_time);
  }

  if(params.hasOwnProperty("last_start_time")){

    query.append("last_start_time", params.last_start_time);
  }

  if(params.hasOwnProperty("comment_create_time")){

    query.append("comment_create_time", params.comment_create_time);
  }

  url = url + query.toString();

  function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      cookie[key.trim()] = value;
    })
    return cookie[cookieName];
  }

  let locale = getCookie("locale");

  let localeJson = {
    'rating_review': 'Rating & Reviews ',
    'view_all': 'View All',
    'no_comment': 'This product has no reviews yet.'
  };

  if(locale == 'zh_TW'){

    localeJson = {
      'rating_review': '評級 & 評論 ',
      'view_all': '查看全部',
      'no_comment': '該產品還沒有評論。'
    };
  }

  fetch( url, {
    method: 'get',
    header: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })
  .then(function(response){

    return response.json()
  })
  .then(function(data){

    if(data.status && data.data){

      // temporary not involve this function
      if(['lazada-malaysia1', 'lazada-singapore1', 'lazada-thailand1'].includes(marketplaceHandle)){

        ShopeeTaiwanData['comments'] = [...ShopeeTaiwanData['comments'], ...data.data.comments];
        ShopeeTaiwanData['next_page'] = data.data.next_page;
        ShopeeTaiwanData['last_start_time'] = data.data.last_start_time;
        ShopeeTaiwanData['next_end_time'] = data.data.next_end_time;
        ShopeeTaiwanData['next_start_time'] = data.data.next_start_time;
        ShopeeTaiwanData['comment_create_time'] = data.data.comment_create_time;

        let headerHtmlString = '';
        let modalHeaderHtmlString = '';

        headerHtmlString += '<div>';

        //Lazada
        if(marketplaceHandle == 'lazada-malaysia'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Malaysia.svg"></div>';
        }
        else if(marketplaceHandle == 'lazada-singapore'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Singapore.svg.png"></div>';
        }
        else if(marketplaceHandle == 'lazada-thailand'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Thailand.png"></div>';
        }
        else if(marketplaceHandle == 'lazada-taiwan'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Taiwan.png"></div>';
        }

        headerHtmlString += '<div style="display: flex; justify-content: space-between;font-size:1.2rem;"><div>' + localeJson.rating_review;

        headerHtmlString += '</b></div>';

        modalHeaderHtmlString = headerHtmlString;
        headerHtmlString += '<div id="view_' + appId + '" data-apps-id="app252c9f9349aabc05" class="view-all-text toggle-modal display-none">' + localeJson.view_all + '</div>';

        headerHtmlString += '</div>';
        headerHtmlString += '</div>';
        modalHeaderHtmlString += '</div>';
        modalHeaderHtmlString += '</div>';

        if(ShopeeTaiwanData.last_start_time){

          if(!ShopeeTaiwanData.is_initiated){

            let initComments = [];
            let initContentHtmlString = '';
            let modalContentHtmlString = '';

            $('#comment_' + appId + ' .comment-header').html(headerHtmlString);
            $(`#view_${appId}, #comment-modal_${appId} .toggle-modal, #comment-modal_${appId} .comment-modal-backdrop`).on('click', showModal);
            $('#comment-modal_' + appId + ' .comment-content').addClass('marketplace-comment-modal-spinner');


            if(ShopeeTaiwanData.comments.length > 3){

              initComments = ShopeeTaiwanData.comments.slice(0, 3)

              if( $('#view_' + appId).hasClass('display-none')){

                $('#view_' + appId).removeClass('display-none');
              }
            }
            else{

              if(ShopeeTaiwanData.comments.length < 3){

                $('#comment_' + appId + ' .comment-content-init').addClass('marketplace-comment-modal-spinner')
              }

              initComments = ShopeeTaiwanData.comments
            }

            ShopeeTaiwanData.init_comments.push(...initComments);

            if(initComments.length){

              initContentHtmlString = generateShopeeTaiwanCommentHtmlString(initComments);
            }

            $('#comment_' + appId + ' .comment-content-init').html(initContentHtmlString);

            if(ShopeeTaiwanData.comments.length){

              modalContentHtmlString = generateShopeeTaiwanCommentHtmlString(ShopeeTaiwanData.comments);
            }

            modalContentHtmlString = modalHeaderHtmlString + modalContentHtmlString;
            $('#comment-modal_' + appId + ' .comment-content').html(modalContentHtmlString)

            ShopeeTaiwanData.is_initiated = true;
          }
          else{

            let comments = [];
            let contentHtmlString = '';
            comments = [...data.data.comments];

            if(ShopeeTaiwanData.comments.length > 3){

              if( $('#view_' + appId).hasClass('display-none')){

                $('#view_' + appId).removeClass('display-none');
              }
            }

            if(ShopeeTaiwanData.init_comments.length < 3){

              let initComments = [];
              let initContentHtmlString = '';
              let requireCommentsCount = 3 - ShopeeTaiwanData.init_comments.length;

              initComments = comments.slice(0, requireCommentsCount);

              if(initComments.length){

                initContentHtmlString = generateShopeeTaiwanCommentHtmlString(initComments);

                $('#comment_' + appId + ' .comment-content-init').append(initContentHtmlString);
                ShopeeTaiwanData.init_comments.push(initComments);
              }
            }
            else{

              if($('#comment_' + appId + ' .comment-content-init').hasClass('marketplace-comment-modal-spinner')){

                $('#comment_' + appId + ' .comment-content-init').removeClass('marketplace-comment-modal-spinner');
              }
            }

            if(comments.length){

              contentHtmlString = generateShopeeTaiwanCommentHtmlString(comments);
            }

            $('#comment-modal_' + appId + ' .comment-content').append(contentHtmlString)
          }

          if( $('#comment_' + appId).hasClass('display-none')){

            $('#comment_' + appId).removeClass('display-none');
          }

          if(ShopeeTaiwanData.comments.length < 200){

            let nextParams = {
              next_start_time : ShopeeTaiwanData.next_start_time,
              next_end_time : ShopeeTaiwanData.next_end_time,
              next_page : ShopeeTaiwanData.next_page,
              last_start_time: ShopeeTaiwanData.last_start_time,
              comment_create_time: ShopeeTaiwanData.comment_create_time
            };

            if(ShopeeTaiwanData.next_end_time > ShopeeTaiwanData.last_start_time){

              getShopeeTaiwanProductComments(productId, nextParams);
            }
          }
          else{

            if($('#comment_' + appId + ' .comment-content-init').hasClass('marketplace-comment-modal-spinner')){

              $('#comment_' + appId + ' .comment-content-init').removeClass('marketplace-comment-modal-spinner');
            }

            if($('#comment-modal_' + appId + ' .comment-content').hasClass('marketplace-comment-modal-spinner')){

              $('#comment-modal_' + appId + ' .comment-content').removeClass('marketplace-comment-modal-spinner');
            }
          }

          if(ShopeeTaiwanData.next_end_time <= ShopeeTaiwanData.last_start_time){

            if($('#comment_' + appId + ' .comment-content-init').hasClass('marketplace-comment-modal-spinner')){

              $('#comment_' + appId + ' .comment-content-init').removeClass('marketplace-comment-modal-spinner');
            }

            if($('#comment-modal_' + appId + ' .comment-content').hasClass('marketplace-comment-modal-spinner')){

              $('#comment-modal_' + appId + ' .comment-content').removeClass('marketplace-comment-modal-spinner');
            }

            if(ShopeeTaiwanData.comments.length < 1){

              $('#comment_' + appId + ' .comment-content-init').html(localeJson.no_comment);
            }
          }
        }
        else{

          if(!ShopeeTaiwanData.is_initiated){

            $('#comment_' + appId + ' .comment-header').html(headerHtmlString);
          }

          if(ShopeeTaiwanData.comments.length < 1){

            $('#comment_' + appId + ' .comment-content-init').html(localeJson.no_comment);
          }

          if($('#comment_' + appId + ' .comment-content-init').hasClass('marketplace-comment-modal-spinner')){

            $('#comment_' + appId + ' .comment-content-init').removeClass('marketplace-comment-modal-spinner');
          }

          if($('#comment-modal_' + appId + ' .comment-content').hasClass('marketplace-comment-modal-spinner')){

            $('#comment-modal_' + appId + ' .comment-content').removeClass('marketplace-comment-modal-spinner');
          }

          if( $('#comment_' + appId).hasClass('display-none')){

            $('#comment_' + appId).removeClass('display-none');
          }
        }

      }
      else{

        let isInit = false;

        if(ShopeeTaiwanData.next_page === 0){

          isInit = true;
        }

        ShopeeTaiwanData['comments']    = [...ShopeeTaiwanData['comments'], ...data.data.comments];
        ShopeeTaiwanData['has_more']    = data.data.has_more;
        ShopeeTaiwanData['next_page']   = data.data.next_page;
        ShopeeTaiwanData['total_count'] = data.data.total_count;

        let headerHtmlString = '';
        let modalHeaderHtmlString = '';

        headerHtmlString += '<div>';
        //Shopee
        if(marketplaceHandle == 'shopee-malaysia'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/Shopee.svg" /><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Malaysia.svg"></div>';
        }
        else if(marketplaceHandle == 'shopee-singapore'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/Shopee.svg" /><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Singapore.svg.png"></div>';
        }
        else if(marketplaceHandle == 'shopee-thailand'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/Shopee.svg" /><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Thailand.png"></div>';
        }
        else if(marketplaceHandle == 'shopee-taiwan'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/Shopee.svg" /><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Taiwan.png"></div>';
        }
        else if(marketplaceHandle == 'shopee-indonesia'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/Shopee.svg" /><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Indonesia.png"></div>';
        }

        //Lazada
        if(marketplaceHandle == 'lazada-malaysia'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Malaysia.svg"></div>';
        }
        else if(marketplaceHandle == 'lazada-singapore'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Singapore.svg.png"></div>';
        }
        else if(marketplaceHandle == 'lazada-thailand'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Thailand.png"></div>';
        }
        else if(marketplaceHandle == 'lazada-taiwan'){
          headerHtmlString += '<div class="logo-flag-wrapper"><img src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/lazada.png"><img class="flag" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/Flag_of_Taiwan.png"></div>';
        }

        headerHtmlString += '<div style="display: flex; justify-content: space-between;font-size:1.2rem;"><div>' + localeJson.rating_review;

        if(ShopeeTaiwanData.total_count !== null){

          headerHtmlString += ' (' + ShopeeTaiwanData.total_count + ')</div>';
        }
        else{

          headerHtmlString += '</b></div>';
        }


        modalHeaderHtmlString = headerHtmlString;

        if(ShopeeTaiwanData.comments.length > 3){

          headerHtmlString += '<div id="view_' + appId + '" data-apps-id="app252c9f9349aabc05" class="view-all-text toggle-modal">' + localeJson.view_all + '</div>';
        }

        headerHtmlString += '</div>';
        headerHtmlString += '</div>';
        modalHeaderHtmlString += '</div>';
        modalHeaderHtmlString += '</div>';

        if(params.next_page === 1){

          $('#comment_' + appId + ' .comment-header').html(headerHtmlString);

          $(`#view_${appId}, #comment-modal_${appId} .toggle-modal, #comment-modal_${appId} .comment-modal-backdrop`).on('click', showModal);
        }

        let initComments = [];
        let initContentHtmlString = '';

        if(isInit){

          if(ShopeeTaiwanData.comments.length > 3){

            initComments = ShopeeTaiwanData.comments.slice(0, 3)
          }
          else{

            initComments = ShopeeTaiwanData.comments
          }

          if(initComments.length){

            initContentHtmlString = generateShopeeTaiwanCommentHtmlString(initComments);
          }
          else{

            initContentHtmlString = localeJson.no_comment;
          }

          $('#comment_' + appId + ' .comment-content-init').html(initContentHtmlString);
        }


        if(ShopeeTaiwanData.comments.length > 3){

          let modalComments = [];
          modalComments = [...data.data.comments];

          let modalContentHtmlString = '';

          if(modalComments.length){

            modalContentHtmlString = generateShopeeTaiwanCommentHtmlString(modalComments);
          }

          if(modalContentHtmlString){

            if(params.next_page === 1){

              modalContentHtmlString = modalHeaderHtmlString + modalContentHtmlString;
              $('#comment-modal_' + appId + ' .comment-content').html(modalContentHtmlString);
            }
            else{

              $('#comment-modal_' + appId + ' .comment-content').append(modalContentHtmlString);
            }
          }

          if($('#comment-modal_' + appId + ' .comment-content').hasClass('marketplace-comment-modal-spinner')){

            $('#comment-modal_' + appId + ' .comment-content').removeClass('marketplace-comment-modal-spinner');
          }
        }

        ShopeeTaiwanData.is_loading = false;


        if( $('#comment_' + appId).hasClass('display-none')){

          $('#comment_' + appId).removeClass('display-none');
        }

        if(params.next_page === 1){

          $('#comment-modal_' + appId + ' .comment-content').on('scroll', function() {

            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {

              if(ShopeeTaiwanData.next_page && !ShopeeTaiwanData.is_loading){

                ShopeeTaiwanData.is_loading = true;
                $(this).addClass('marketplace-comment-modal-spinner')

                let nextParams = {
                  next_page : ShopeeTaiwanData.next_page
                };

                getShopeeTaiwanProductComments(productId, nextParams);

              }
            }
          });
        }
      }
    }
  });
}

function generateShopeeTaiwanCommentHtmlString(comments)
{

  let marketplaceGeneralName = 'Shopee';
  let marketplaceHandle = 'shopee-taiwan';

  let fullstar = '<span class="es-icon-star es-star"></span>';
  let halfstar = '<span class="es-icon-star es-half-star"></span>';
  let emptystar = '<span class="es-icon-star es-empty-star"></span>';

  let contentHtmlString = '';

  comments.forEach(comment => {

    contentHtmlString += '<div class="comment-wrapper">';

    contentHtmlString += '<div class="margin-top-10 justify-content">';
    contentHtmlString += '<div class="flex"><span style="font-size:1rem;color:grey;">' + comment.buyer_username + '</span>';

    if(!comment.is_buyer_name_exist){

      contentHtmlString += '<span class="comment-badge" style="display:flex;"><img class="lazada-badge" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/apps/verified.png">' + marketplaceGeneralName + "'s buyer</span>";
    }

    contentHtmlString += '</div>';
    contentHtmlString += '<div>' + comment.created_at + '</div>';
    contentHtmlString += '</div>';


    contentHtmlString += '<div class="margin-top-10">';

    if(comment.rating >= 4.8){
      contentHtmlString += fullstar + fullstar + fullstar + fullstar + fullstar;
    }else if(comment.rating >= 4.3){
      contentHtmlString += fullstar + fullstar + fullstar + fullstar + halfstar;
    }else if(comment.rating >= 3.8){
      contentHtmlString += fullstar + fullstar + fullstar + fullstar + emptystar;
    }else if(comment.rating >= 3.3){
      contentHtmlString += fullstar + fullstar + fullstar + halfstar + emptystar;
    }else if(comment.rating >= 2.8){
      contentHtmlString += fullstar + fullstar + fullstar + emptystar + emptystar;
    }else if(comment.rating >= 2.3){
      contentHtmlString += fullstar + fullstar + halfstar + emptystar + emptystar;
    }else if(comment.rating >= 1.8){
      contentHtmlString += fullstar + fullstar + emptystar + emptystar + emptystar;
    }else if(comment.rating >= 1.3){
      contentHtmlString += fullstar + halfstar + emptystar + emptystar + emptystar;
    }else if(comment.rating >= 1){
      contentHtmlString += fullstar + emptystar + emptystar + emptystar + emptystar;
    }else{
      contentHtmlString += emptystar + emptystar + emptystar + emptystar + emptystar;
    }
    contentHtmlString += '</div>';

    contentHtmlString += '<div class="margin-top-10">' + comment.comment + '</div>';

    if(comment.images.length){

      contentHtmlString += '<div class="margin-top-10">';

      comment.images.forEach( image => {

        contentHtmlString += '<img src="' + image + '" width="100" height="100" style="margin-right: 10px;">'
      })

      contentHtmlString += '</div>';
    }

    if(comment.videos.length){

      contentHtmlString += '<div class="margin-top-10">';

      comment.videos.forEach( video => {

        contentHtmlString += '<iframe src="' + video + '" width="270" height="200" style="margin-right: 10px;"></iframe>';
      })

      contentHtmlString += '</div>';
    }

    contentHtmlString += '</div>';
  })

  return contentHtmlString;
}

function getShopeeTaiwanProductRating(productId)
{

  let appId = 'app252c9f9349aabc05';
  let marketplaceHandle = 'shopee-taiwan';
  let url = '/apps/shopee-taiwan/products/' + productId + '/rating?shop=iluxuryuk.easy.co';

  function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      cookie[key.trim()] = value;
    })
    return cookie[cookieName];
  }

  let locale = getCookie("locale");

  let localeJson = {
    'sold': 'Sold'
  };

  if(locale == 'zh_TW'){

    localeJson = {
      'sold': '已售出',
    };
  }

  fetch( url, {
    method: 'get',
    header: {
      "Content-Type": "application/json; charset=utf-8",
    }
  })
  .then(function(response){

    return response.json()
  })
  .then(function(data){

    let htmlString = '';

    let fullstar = '<span class="es-icon-star es-star"></span>',
    halfstar = '<span class="es-icon-star es-half-star"></span>',
    emptystar = '<span class="es-icon-star es-empty-star"></span>';

    if(data.status && data.data){

      let productInfo = data.data;

      if(marketplaceHandle == 'shopee-malaysia'){
        htmlString += '<div class="marketplace-origin-wrapper"><b class="marketplace-origin-text">MY</b><img class="marketplace-origin-logo-img" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/shopee-logo.webp" />';
      }
      else if(marketplaceHandle == 'shopee-singapore'){
        htmlString += '<div class="marketplace-origin-wrapper"><b class="marketplace-origin-text">SG</b><img class="marketplace-origin-logo-img" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/shopee-logo.webp" />';
      }
      else if(marketplaceHandle == 'shopee-thailand'){
        htmlString += '<div class="marketplace-origin-wrapper"><b class="marketplace-origin-text">TH</b><img class="marketplace-origin-logo-img" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/shopee-logo.webp" />';
      }
      else if(marketplaceHandle == 'shopee-taiwan'){
        htmlString += '<div class="marketplace-origin-wrapper"><b class="marketplace-origin-text">TW</b><img class="marketplace-origin-logo-img" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/shopee-logo.webp" />';
      }
      else if(marketplaceHandle == 'shopee-indonesia'){
        htmlString += '<div class="marketplace-origin-wrapper"><b class="marketplace-origin-text">ID</b><img class="marketplace-origin-logo-img" src="https://s3.ap-southeast-1.amazonaws.com/easystore.website/images/partners/partner-logo/shopee-logo.webp" />';
      }
      htmlString += '<div>';

      if(productInfo.rating >= 4.8){
        htmlString += fullstar + fullstar + fullstar + fullstar + fullstar;
      }else if(productInfo.rating >= 4.3){
        htmlString += fullstar + fullstar + fullstar + fullstar + halfstar;
      }else if(productInfo.rating >= 3.8){
        htmlString += fullstar + fullstar + fullstar + fullstar + emptystar;
      }else if(productInfo.rating >= 3.3){
        htmlString += fullstar + fullstar + fullstar + halfstar + emptystar;
      }else if(productInfo.rating >= 2.8){
        htmlString += fullstar + fullstar + fullstar + emptystar + emptystar;
      }else if(productInfo.rating >= 2.3){
        htmlString += fullstar + fullstar + halfstar + emptystar + emptystar;
      }else if(productInfo.rating >= 1.8){
        htmlString += fullstar + fullstar + emptystar + emptystar + emptystar;
      }else if(productInfo.rating >= 1.3){
        htmlString += fullstar + halfstar + emptystar + emptystar + emptystar;
      }else if(productInfo.rating >= 1){
        htmlString += fullstar + emptystar + emptystar + emptystar + emptystar;
      }else{
        htmlString += emptystar + emptystar + emptystar + emptystar + emptystar;
      }

      htmlString += '</div>';
      htmlString += '<div class="marketplace-origin-avg-rating">' + productInfo.rating + '/5 </div>';

      let saleValue = '';

      if(productInfo.sales > 1000){

        saleValue = (Math.floor(productInfo.sales/100.0)/10.0).toFixed(1) + 'k';
      }
      else{

        saleValue = productInfo.sales;
      }

      htmlString += '<div>' + saleValue + ' ' + localeJson.sold + ' </div>';
      htmlString += '</div>';

      $('#rating_' + appId).html(htmlString);
    }
  });
}

function expandShopeeTaiwanCommentCard()
{

  let appId = 'app252c9f9349aabc05';
  let marketplaceHandle = 'shopee-taiwan';
  let comments = ShopeeTaiwanData.comments;
  let contentHtmlString = '';

  if(comments.length){

    contentHtmlString = generateShopeeTaiwanCommentHtmlString(comments);
  }

  if(contentHtmlString){

    $('#comment_' + appId + ' .comment-content').html(contentHtmlString);
    $('#view_' + appId).addClass('display-none');

    $('#comment_' + appId + ' .comment-content').scrollTop($('#comment_' + appId + ' .comment-content')[0].scrollHeight);
  }

}

function showModal()
{

  var apps_id = $(this).data('apps-id');
  var comment_modal = document.getElementById('comment-modal_' + apps_id);

  if(comment_modal.dataset.modalVisible == 'false'){

    comment_modal.classList.remove('display-none');
    comment_modal.dataset.modalVisible = 'true';
  }
  else{
    comment_modal.classList.add('display-none');
    comment_modal.dataset.modalVisible = 'false';
  }

}



