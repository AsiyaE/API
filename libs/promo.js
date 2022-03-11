module.exports = app => {
    const fs = require('fs');
    const file = './libs/data.json';

    app
    .use((req, res, next) => {
        fs.readFile(file, (err, data) => {
            if (err){
				console.log(err);
                return res
					.status(500)
					.send({ message: 'Error while getting products',
					'error': err});
			}
			req.products  = JSON.parse(data);
			next();
		});
	});
	app
	.route('/promo')
	.get( (req, res) => {
		console.log(req.param);
		if (!req.products){
			return res
				.status(404)
				.send({ message: 'Promo not found. Empty list' });
		}
		if (req.params){ //products/${id}      // .route('/products/:id') {}
			console.log("params",req.params);
			let elem=req.products.filter(item =>(item.id == req.params.id));
			if (elem.length>0) { 
				console.log("elem.length>0");
				return res
					.status(200)
					.send(elem[0]);
			}
		}
		if(Object.keys(req.query).length != 0){  // подходящие по запросу /products?query=string [{},{}]
			console.log("query",req.query);
			
			const list=req.products.filter(item => ((item.id == req.query.id)
			||(item.name == req.query.name)||(item.description == req.query.description))); 
			if (list.length>0){ 
				return res
					.status(200)
					.send(list);
			}
			else
				return res
					.status(404)
					.send({ message: 'Promo not found.(query)' }); 
		}
		const resultList=req.products.forEach(function(item, index, array) {
			delete item.prizes;
			delete item.participants;
		})
		console.log(resultList);
			return res
					.status(200)
					.send(resultList); 
	})
}