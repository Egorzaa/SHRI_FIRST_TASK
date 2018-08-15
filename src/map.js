import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';

export function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: ["zoomControl"],
    zoom: 10
  });

  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart', //diagram on cluster
    clusterDisableClickZoom: false,  //cluster will not zoom up on click
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps) //not in docs
  });

  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

  loadList().then(data => {
    console.log(data);
    // objectManager.add(data);
    // ymaps.geoQuery(data).addToMap(myMap);
    data.features.forEach(function(element) {
      element.geometry.coordinates.reverse();    
    });
    console.log(data.features);
    var result = ymaps.geoQuery(data);
    result.addToMap(myMap);
    myMap.geoObjects.add(result.search('geometry.type == "Point"').clusterize());
    
    console.log(result);
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
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    objectManager.objects.balloon.open(objectId);

    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      });
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
