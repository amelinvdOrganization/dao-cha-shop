// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError (desc, page, line) {
  var img=document.createElement('img');
  img.src = 'http://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';

  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Форматирует цену
function number_format(number,decimals,dec_point,thousands_sep){var n=number,prec=decimals;var toFixedFix=function(n,prec){var k=Math.pow(10,prec);return(Math.round(n*k)/k).toString();};n=!isFinite(+n)?0:+n;prec=!isFinite(+prec)?0:Math.abs(prec);var sep=(typeof thousands_sep==='undefined')?',':thousands_sep;var dec=(typeof dec_point==='undefined')?'.':dec_point;var s=(prec>0)?toFixedFix(n,prec):toFixedFix(Math.round(n),prec);var abs=toFixedFix(Math.abs(n),prec);var _,i;if(abs>=1000){_=abs.split(/\D/);i=_[0].length%3||3;_[0]=s.slice(0,i+(n<0))+
_[0].slice(i).replace(/(\d{3})/g,sep+'$1');s=_.join(dec);}else{s=s.replace('.',dec);}
var decPos=s.indexOf(dec);if(prec>=1&&decPos!==-1&&(s.length-decPos-1)<prec){s+=new Array(prec-(s.length-decPos-1)).join(0)+'0';}
else if(prec>=1&&decPos===-1){s+=dec+new Array(prec).join(0)+'0';}
return s;}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType (LinkObject, InputObject) {
  var 
    // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.text(),
    // Новый текст ссылки
    txtNew = LObject.attr('rel');

  // Если объекты не получены, завершим работу функции
  if( LObject.length==0 || IObject.length==0 ) {
    return false;
  }

  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel 
  LObject.attr('rel', txtOld);

  // Изменяем тип input поля
  if(IObject[0].type == 'text') {
    IObject[0].type = 'password';
  } else {
    IObject[0].type = 'text';
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img,num,cnt) {
  if(cnt>13) {
    return false;
  }

  $(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
  num = (num==6)?0:num;
  setTimeout(function(){RefreshImageAction(img, num+1, cnt+1);}, 50);
}

$(document).ready(function(){
  // Кнопки на сайте если подгружен модуль Jquery.UI
  if(typeof($('input:submit, input.button').button) == "function" ) {
    $('input:submit, input.button').button();
  }

  // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
  $('.order form, .feedbackForm, .clientForm, .goodsDataOpinionAddForm').submit(function(){
    if($(this).valid()) {
      SubmitButton = $(this).find('input:submit, button:submit').attr('disabled', true);
      setTimeout('SubmitButton.attr("disabled", false);', 10000);
    }
  }).validate();

  // В форме оформления заказа при клике на кнопку назад просто переходим на предыдущую страницу
  $('.order form input:submit[name="toprev"]').click(function(){
    var act = this.form.action;
    this.form.action = act + ( act.indexOf( '\?' ) > -1 ? '&' : '?' ) + 'toprev=1';
    this.form.submit();
    return false;
  });
  
  // Настройки галереи изображений
  $.nyroModalSettings({
    // из всех элементов с атрибут rel="gallery" будем создавать галерею
    gallery: 'gallery',
    // Включаем прокрутку с последнего изображения на первое
    galleryLoop: true
  });
   
  // Увеличение изображение при клике на него и открытие галереи изображений
  $('.goodsDataMainImage a, .goodsDataMainImageZoom a').click(function(){
        
        // Идентификатор главной картинки
    var goodsImageId = $('.goodsDataMainImage input').attr("rel"),
        
        // Маленькое изображение, по которому на самом деле будем кликать
        goodsImageIconElement = $('.goodsDataMainImagesIcon input[rel="'+goodsImageId+'"]').parent().find('a');

    // Для иконки изображения запустим галерею  
    goodsImageIconElement.nyroModalManual();
    return false;
  });
  
  // Добавление товара в корзину через ajax
  $('.goodsDataForm, .goodsToCartFromCompareForm').submit(function(){
    $(this).nyroModalManual({
      formIndicator: 'ajax_q',  // Value added when a form is sent
      minWidth: 420, // Minimum width
      minHeight: 150, // Minimum height
      gallery: null // Gallery name if provided
    });
    return false;
  });
  
  // Изменение главного изображения товара при нажатии на миниатюру
  $('.goodsDataMainImagesIcon a').click(function(){
        // Путь к среднему изображению
    var MediumImageUrl = $(this).find('img').attr('rel'),
        
        // Главное изображение, в которое будем вставлять новое изображение
        MainImage = $('.goodsDataMainImage img'),
        
        // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
        MainImageIdObject = $('.goodsDataMainImage input'),
        
        // Получаем идентификатор этого изображения из соседнего input поля
        GoodsImageIconId = $(this).parent().find('input').attr("rel");
    
    // Изменяем главное изображение
    MainImage.attr('src',MediumImageUrl);
    
    // Изменяем идентификатор главного изображения
    MainImageIdObject.attr("rel",GoodsImageIconId);
    
    return false;
  });

  // Функция собирает свойства в строку, для определения модификации товара
  function getSlugFromGoodsDataFormModificationsProperties(obj) {
    var properties = new Array();
    $(obj).each(function(i){
      properties[i] = parseInt($(this).val());
    });
    return properties.sort(function(a,b){return a - b}).join('_');
  }
  
  
  var goodsDataProperties = $('.goodsDataForm [name="form[properties][]"]');
  
  // Изменение цены товара при изменении у товара свойства для модификации
  goodsDataProperties.each(function(){
    $(this).change(function(){
      var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
          modificationBlock             = $('.goodsDataMainModificationsList[rel="'+slug+'"]'),
          modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
          modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
          modificationPriceNow          = parseFloat(modificationBlock.find('[name="price_now"]').val()),
          modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
          modificationPriceOld          = parseFloat(modificationBlock.find('[name="price_old"]').val()),
          modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
          modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
          modificationDescription       = modificationBlock.find('.description').html(),
          modificationMeasureId         = parseInt(modificationBlock.find('[name="measure_id"]').val()),
          modificationMeasureName       = modificationBlock.find('[name="measure_name"]').val(),
          modificationMeasureDesc       = modificationBlock.find('[name="measure_desc"]').val(),
          modificationMeasurePrecision  = modificationBlock.find('[name="measure_precision"]').val(),
          modificationIsHasInCompareList= modificationBlock.find('[name="is_has_in_compare_list"]').val(),
          goodsModificationId           = $('.goodsDataMainModificationId'),
          goodsPriceNow                 = $('.goodsDataMainModificationPriceNow'),
          goodsPriceOld                 = $('.goodsDataMainModificationPriceOld'),
          goodsAvailable                = $('.goodsDataMainModificationAvailable'),
          goodsAvailableTrue            = goodsAvailable.find('.available-true'),
          goodsAvailableFalse           = goodsAvailable.find('.available-false'),
          goodsArtNumberBlock           = $('.goodsDataMainModificationArtNumber'),
          goodsArtNumber                = goodsArtNumberBlock.find('span');
          goodsCompareAddButton         = $('.goodsDataCompareButton.add');
          goodsCompareDeleteButton      = $('.goodsDataCompareButton.delete');
          goodsModDescriptionBlock      = $('.goodsDataMainModificationsDescriptionBlock');
       
       // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
       if(modificationBlock.length) {
         // Цена товара
         goodsPriceNow.html(modificationPriceNowFormated);
  
         // Старая цена товара
         if(modificationPriceOld>modificationPriceNow) {
          goodsPriceOld.html(modificationPriceOldFormated);
         } else {
           goodsPriceOld.html('');
         }
         
         // Есть ли товар есть в наличии
         if(modificationRestValue>0) {
           goodsAvailableTrue.show();
           goodsAvailableFalse.hide();
         // Если товара нет в наличии
         } else {
           goodsAvailableTrue.hide();
           goodsAvailableFalse.show();
         }
         // Если товар есть в списке сравнения
         if(modificationIsHasInCompareList>0) {
           goodsCompareAddButton.hide();
           goodsCompareDeleteButton.show();
         // Если товара нет в списке сравнения
         } else {
           goodsCompareAddButton.show();
           goodsCompareDeleteButton.hide();
         }
         
         // Покажем артикул модификации товара, если он указан
         if(modificationArtNumber.length>0) {
           goodsArtNumberBlock.show();
           goodsArtNumber.html(modificationArtNumber);
         // Скроем артикул модификации товара, если он не указан
         } else {
           goodsArtNumberBlock.hide();
           goodsArtNumber.html('');
         }

         // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
         if(modificationDescription.length > 0) {
           goodsModDescriptionBlock.show().html('<div>' + modificationDescription + '</div>');
         } else {
           goodsModDescriptionBlock.hide().html();
         }
         
         
         // Идентификатор товарной модификации
         goodsModificationId.val(modificationId);
         window.location.hash = '?modification='+modificationId;
       } else {
         // Отправим запись об ошибке на сервер
         sendError('no modification by slug '+slug);
         alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
       }
    });
  });
  
  // Кнопка добавления товара на сравнение сравнения товаров
  $('.goodsDataCompareButton').click(function(){
    window.location.href = $(this).attr('rel') +
    ($(this).attr('rel').indexOf( '\?' ) > -1 ? '&' : '?') +
    'id='+
    $('.goodsDataMainModificationId').val()+
    '&from='+
    $('input[name="form[goods_from]"]').val();
    return false;
  });
  
  // Сравнение товаров. Увеличение изображение при клике на ссылку увеличения и открытие галереии с изображениями этого товара
  $('.CompareGoodsImageZoom').click(function(){

    // Галлерея фотографий для данной модификации товаров
    var galleryBlock = $('.galleryBlock' +  $(this).attr('rel')),

    // Главное изображение товара, которое сейчас стоит у товара
    galleryMainImage = $('.CompareGoodsImageMain' +  $(this).attr('rel')),

    // Изображение по которому нужно кликнуть в галлерее изображений
    ImageIngallery = galleryBlock.find('.CompareGoodsImageGallery'+galleryMainImage.attr('rel'));
    
    // Запускаем галлерею изображений от изображения товара, чтобы если например кликнули по гайке, то и открылись гайка, а не еще какой-либо изображение этого товара
    ImageIngallery.nyroModalManual({
      gallery: 'gallery' +  $(this).attr('rel')
    });

    return false;
  });
  
  // Сравнение товаров. Инвертирование свойств для сравнения товара
  $('.CompareCheckbox.invert').click(function(){
    var checked = true,
        checkboxes = $('.CompareCheckbox:not(.invert)');

    checkboxes.each(function(){
      if($(this).attr('checked')) {
        checked = false;
        return false;
      }
    });
    
    checkboxes.each(function(){
      $(this).attr('checked', checked);
    });
    
    $(this).attr('checked', checked);
  });
  
  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $('.CompareGoodsHideSelected').click(function(){

    $('.CompareGoodsTableTbodyComparisonLine').each(function(){
      var CheckedCheckbox = $(this).find('.CompareCheckbox:checked:not(.invert)');
      if(CheckedCheckbox.length>0) {
        $(this).hide();
      }
    });

    // отменяем выделение характеристик товаров
    $('.CompareCheckbox').attr('checked',false);

    return false;
  });
  
  // Сравнение товаров. Отображение скрытых характеристик товара
  $('.CompareGoodsShowAll').click(function(){
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    return false;
  });
  
  // Сравнение товаров. Верхняя навигация изменение фильтра на отображение всех характеристик товаров
  $('.CompareGoodsTableFilterShowAll').click(function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    
    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });

  // Сравнение товаров. Фильтр в верхней навигации. Отображение только различающихся характеристик товара
  $('.CompareGoodsTableFilterShowOnlyDifferent').click(function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:not(.same)').show();
    $('.CompareGoodsTableTbodyComparisonLine.same').hide();

    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });

  // Сравнение товаров. При наведении на строку сравнения, она выделяется цветом
  $('.CompareGoodsTableTbodyComparisonLine').hover(
    function () { $(this).addClass('hover'); }, 
    function () { $(this).removeClass('hover'); }
  );
  
  // При клике по строке выделяем свойство
  $('.CompareGoodsTableTbodyComparisonLine td:not(.ceil1)').click(function(){
    var CompareCheckbox = $(this).parent().find('.CompareCheckbox');

    if(CompareCheckbox.attr('checked')) {
      CompareCheckbox.attr('checked', false);
    } else {
      CompareCheckbox.attr('checked', true);
    }
  });

  // Форма регистрации нового пользователя, действие ссылки "показать пароль"
  $('.clientForm .showPass').click(function(){
    ChangePasswordFieldType(this, $('#sites_client_pass'));
    return false;
  });
  
  // Форма регистрации нового пользователя, при оформлении заказа
  $('.OrderShowPass').click(function(){
    ChangePasswordFieldType(this, $('#contactPassWord'));
    return false;
  });

  // При вводе пароля с caps lockом, покажет блок с сообщением для пользователя
  $('#sites_client_pass, #contactPassWord').capslock({
    caps_lock_on:function(){$("#caps_lock").show();},
    caps_lock_off:function(){$("#caps_lock").hide();}
  });
  
  // При оформлении заказа дадим возможность зарегистрироваться пользователю
  $('#contactWantRegister').click(function(){
    if($(this).attr("checked")) {
      $('.contactRegisterNeedElement').show();
      $('#contactEmail, #contactPassWord').addClass('required');
    } else {
      $('.contactRegisterNeedElement').hide();
      $('#contactEmail, #contactPassWord').removeClass('required');
    }
  });

  // Добавление отзыва о товаре. Рейтинг
  if(typeof($('.goodsDataOpinionTableRating').stars) == "function" ) {
    $('.goodsDataOpinionTableRating').stars({
      inputType: "input",
      split: 2,
      captionEl: $(".goodsDataOpinionMsg"),
      cancelShow: false
    });
  }

  
  // Список отзывов о товаре. Ссылка на отображение формы для добавление отзыва о товаре
  $('.goodsDataOpinionShowAddForm').click(function(){
    if(0 == $('#goodsDataOpinionAddBlock:visible').length) {
      $('#goodsDataOpinionAddBlock').show('blind');
    } else {
      $('#goodsDataOpinionAddBlock').hide('blind');
      return false;
    }
  });

  // Добавление отзыва о товаре. кнопка reset скрывающая форму добавления отзыва о товаре
  $('.goodsDataOpinionAddForm input:reset').click(function(){
    $('#goodsDataOpinionAddBlock').hide('blind');
  });

  // Иконка для обновления изображение капчи
  $('.goodsDataOpinionCaptchaRefresh').click(function(){
    RefreshImageAction(this,1,1);
    $('.goodsDataOpinionCaptchaImg').attr('src',$('.goodsDataOpinionCaptchaImg').attr('src')+'&rand'+Math.random(0,10000));
    return false;
  });
  
  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $('.contentTbodySearchFilterBlock input').click(function(){
    $(this)[0].form.submit();
  });

  // Действия при выборе варианта доставки на этапе оформления заказа
  $('.deliveryRadio').click(function(){
    
    // Если текущая выделенная зона доставки не относится к выбранному варианту доставки, снимаем выделение с зоны доставки
    if($('.deliveryZoneRadio:checked').attr('deliveryid') != $(this).val()) {
      $('.deliveryZoneRadio:checked').click().attr('checked', false);
    }
  });
  
  // Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
  $('.deliveryZoneRadio').click(function(){
    
    var 
      deliveryId = $(this).attr('deliveryid')
      ,deliveryZonePrice = $(this).parent().find('.deliveryZonePrice')
      ,deliveryTbody = $('.orderStageDeliveryListTable tbody[rel="' + deliveryId + '"]')
      ,deliveryBlock = deliveryTbody.find('#deliveryId' + deliveryId)
      ,deliveryZonePriceBlock = deliveryTbody.find('.orderStageDeliveryZonePrice')
      ,deliveryDefaultPriceBlock = deliveryTbody.find('.orderStageDeliveryDefaultPrice')
    ;

    // Если этот пункт уже выбран, при повторном клике пользователь видимо хочет снять выделение зоны доставки
    if('true' == $(this).attr('rel')) {
      $(this).attr('checked', false);
      $(this).attr('rel', 'false');
      
      // Показываем цену по умолчанию
      deliveryDefaultPriceBlock.show();
      // Скрываем цену образованную от зоны
      deliveryZonePriceBlock.hide();
      
    // Отмечаем у всех радио баттонов зон доставки свойство говорящее что они не отмечены
    } else {
      $('.deliveryZoneRadio').attr('rel', 'false');
      $(this).attr('rel', 'true');
      
      // Показываем цену по умолчанию
      deliveryDefaultPriceBlock.hide();
      // Скрываем цену образованную от зоны
      deliveryZonePriceBlock.show().html(deliveryZonePrice.html());
      
      // Выделяем вариант доставки к которому относится зона доставки
      deliveryBlock.attr('checked', true);
    }
    
  });
  
  $("#deliveryConvenientDate").datepicker({
		dayNames		    : ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
		dayNamesMin		  : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
		closeText		    : 'Готово',
		currentText		  : 'Сегодня' ,
		duration		    : '',
		monthNames		  : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Окрябрь','Ноябрь','Декабрь'],
		monthNamesShort : ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'],
		yearRange		    : "-6:+6",
		dateFormat		  : 'dd.mm.yy',
		minDate         : new Date(),
		firstDay		    : 1
	});
});