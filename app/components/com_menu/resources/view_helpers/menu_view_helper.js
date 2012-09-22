var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

function _weight(item) {
    return item.weight;
}

function _fetch_layout(rs, input) {
    var name = input.layout_name;

    if (!name) {
        return false;
    } else {
        return rs.framework.get_resource('layout', name);
    }

}

function _filter_menus(m) {
    if (_.isString(m)) {
        return {
            name:m,
            title:m.replace(/_/i, ' '),
            items:[]
        }
    } else {
        return m;
    }
}

var _menus = false;

var menu_view_helper = new NE.helpers.View({
    name:'menu_view_helper',
    weight:100,

    init:function (rs, input, cb) {
        if (!rs) {
            throw new Error('no rs');
        }

        //   console.log('NE --- MVH %s', util.inspect(NE));
        var Gate = NE.deps.support.nakamura_gate;

        /* *************** MENUS PASSED THORIUGH FROM ACTIONS ****** */

        var menus = input.menus ? _.map(input.menus, _filter_menus) : [];

        /* **************** PULL MENUS DEFINED IN LAYOUTS ********* */

        var layout = _fetch_layout(rs, input);
        if (layout) {
            var layout_menus = layout.direct_config('menus');
            if (layout_menus) {
                menus = menus.concat(_.map(layout_menus, _filter_menus));
            }
        }

        if (!menus.length) {
            return cb();
        }

        /* **************** ENSURE UNQIUENESS OF MENUS BY NAME ********* */

        menus = _.reduce(menus, function (comp_menus, menu) {
            var dupe = comp_menus[menu.name];

            if (dupe) {
                dupe.items = dupe.items.concat(menu.items);
            } else {
                comp_menus[menu.name] = menu;
            }

            return comp_menus

        }, {});

        var gate = Gate.create();

        _.each(menus, function (site_menu, name) {
            if (!_menus) {
                _menus = rs.action.frame.get_resources('menu');
            }

            _menus.forEach(function (menu) {
                if (_DEBUG)    console.log('getting items fom menu %s for site_menu %s',
                    menu.name,
                    site_menu.name);
                if (menu.use_menu(rs, name)) {
                    var latch = gate.latch(name + '.' + menu.name);
                    menu.items(rs, name, function (err, menus) {
                        if (_DEBUG) console.log('output for site_menu %s from menu %s: ', name, menu.name, JSON.stringify(menus));
                        latch(null, menus);
                    });
                }
            })

        });


        gate.await(function (err, menu_items) {
            // console.log('menu items: %s', JSON.stringify(menu_items));
            if (err) {
                console.log('menu error: %s', err.message);
                cb(err);
                //@TODO: way to abort request fron with in view helper?

            } else {
                if (_DEBUG) console.log('item *********** amalgam: %s', JSON.stringify(menu_items, true, 2))
                if (_DEBUG) console.log('*************')
                input.menus = _.reduce(menu_items,
                    function (menus, items, key) {
                        var item_menus = items[1];
                        var menu_name = key.split('.')[0];
                        if (_DEBUG)     console.log('%s (%s) REDUCING items: %s', key, menu_name, JSON.stringify(_.pluck(item_menus, 'label'), true, 3));


                        var dest_menu = _.find(menus, function (m) {
                            return m.name == menu_name
                        });

                        if (dest_menu) {
                            dest_menu.items = _.sortBy(dest_menu.items.concat(item_menus), _weight);
                        } else {
                            throw new Error('cannot find menu ' + menu_name);
                        }

                        //    console.log(' *********** menu output: %s =============', JSON.stringify(menus))
                        return menus;

                    }, menus)
            }
        });

        if (_DEBUG)    console.log('final menus %s', JSON.stringify(input.menus, true, 3));

        cb();
    }

});

module.exports = function () {
    return menu_view_helper;
}