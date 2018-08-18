import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';
import { getPopupContent } from './popup';

export function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: ["zoomControl"],
    zoom: 10
  });
  // BalloonContentLayout = getDetailsContentLayout(ymaps);
  console.log(myMap);
  const myobjectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart', //diagram on cluster
    clusterDisableClickZoom: false,  //cluster will not zoom up on click
    geoObjectOpenBalloonOnClick: false,

    // clusterIconPieChartRadius: 25,
    // clusterIconPieChartCoreRadius: 10,
    // clusterIconPieChartStrokeWidth: 3,
    geoObjectHideIconOnBalloonOpen: false,
    clusterIconLayout: getDetailsContentLayout(ymaps) //not in docs
  });
  
  myMap.geoObjects.add(myobjectManager);

  myobjectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

  loadList().then(data => {
    console.log(data);
    
    
    data.features.forEach(function(element) {

      element.geometry.coordinates.reverse(); 
     
    });
    myobjectManager.add(data);

  });

  // console.log(objectManager);

  // var myPlacemark = new ymaps.Placemark([55.76, 37.64], {
  //   // Хинт показывается при наведении мышкой на иконку метки.
  //   hintContent: 'Содержимое всплывающей подсказки',
  //   // Балун откроется при клике по метке.
  //   balloonContent: 'Содержимое балуна'
  // });

  // // После того как метка была создана, ее
  // // можно добавить на карту.
  // myMap.geoObjects.add(myPlacemark);
  // console.log(myMap);
  // // myMap.geoObjects.add(objectManager);

  // details
  myobjectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = myobjectManager.objects.getById(objectId);
    console.log(obj);
    myobjectManager.objects.balloon.open(objectId);

    if (!obj.properties.balloonContentBody) {
      loadDetails(objectId).then(data => {
        console.log(data);
        obj.properties.balloonContentBody = getPopupContent(data);

        console.log(obj);
        myobjectManager.objects.balloon.setData(obj);
      });  
    }
  // myMap.geoObjects.options.set({
    // myMap.geoObjects.properties.set('balloonContentBody', getPopupContent(element));    
    // balloonContent: 'цвет <strong>красный</strong>'
    
  // });
    console.log(myobjectManager);
  });
  
  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    myobjectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
