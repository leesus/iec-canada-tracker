'use strict';

export default (req, res, next) => {
  res.render('home/index', {
	  name: 'world'
  });
};