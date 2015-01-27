'use strict';

var jquery = require('jquery');

var d3 = require('../lib/d3'),
    format = require('./format');
var Timedata = {};

module.exports = function (container, directions) {
    var control = {}, map, selection = 0;

    control.addTo = function (_) {
        map = _;
        return control;
    };

    container = d3.select(L.DomUtil.get(container))
        .classed('mapbox-directions-routes', true);

    directions.on('error', function () {
        container.html('');
    });

    directions.on('load', function (e) {
        container.html('');

        var routes = container.append('ul')
            .selectAll('li')
            .data(e.routes)
            .enter().append('li')
            .attr('class', 'mapbox-directions-route');

        routes.append('div')
            .attr('class','mapbox-directions-route-heading')
            .text(function (route) { return 'Route ' + (e.routes.indexOf(route) + 1); });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-summary')
            .text(function (route) { return route.summary; });

        routes.append('div')
            .attr('class', 'mapbox-directions-route-details')
            .text(function (route) { return format.metric(route.distance) + ', ' + format.duration(route.duration); });


            $.getJSON('./tmp/Timedata.json', function(data) {
              Timedata = data;
              var CurrentTime = new Date($.now());
              var TimeSeconds = CurrentTime.getHours()*3600 + CurrentTime.getMinutes()*60 + CurrentTime.getSeconds();

              routes.append('div')
              .attr('class', 'mapbox-directions-route-details')
              .text(function (route) {
                var bool;
                var trainDepartureSplit = Timedata.trainDepartureTimes[0].split(':');
                var trainDepartureSeconds = (+trainDepartureSplit[0]) * 60 * 60 + (+trainDepartureSplit[1]) * 60;
                  var SuccessfulTime = trainDepartureSeconds - (format.extduration(route.duration) + TimeSeconds);
                  console.log('Successful time: ' + SuccessfulTime);
                  console.log('TimeSeconds time: ' + TimeSeconds);
                  console.log('Route time: ' + format.extduration(route.duration));
                  console.log('Train time: ' + trainDepartureSeconds);
                if(SuccessfulTime < 0) {
                  bool = 'Late';
                } else {
                  bool = 'On Time';
                }

                return bool;
              });
            });


        routes.on('mouseover', function (route) {
            directions.highlightRoute(route);
        });

        routes.on('mouseout', function () {
            directions.highlightRoute(null);
        });

        routes.on('click', function (route) {
            directions.selectRoute(route);
        });

        directions.selectRoute(e.routes[0]);
    });

    directions.on('selectRoute', function (e) {
        container.selectAll('.mapbox-directions-route')
            .classed('mapbox-directions-route-active', function (route) { return route === e.route; });
    });

    return control;
};
