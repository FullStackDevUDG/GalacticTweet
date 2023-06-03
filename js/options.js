var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		gravetat:800, velocitat:150,força:350,distMin:100,distancia:[150,300], forat:[100,300]
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"gravetat":800,"velocitat":150,"força":350,"distMin":100, "distancia":[150,300],"forat":[100,300]}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			gravetat:800, 
			velocitat:150,
			força:350,
			distMin:100,
			distancia:[150,300], 
			forat:[100,300]
		},
		created: function(){
			this.gravetat = options_data.gravetat;
			this.velocitat = options_data.velocitat;
			this.força = options_data.força;
			this.distMin = options_data.distMin;
			this.distancia = options_data.distancia;
			this.forat = options_data.forat;
		},
		watch: {
			gravetat: function(value){
				if (value < 400)
					this.gravetat = 400;
				else if (value > 1000)
					this.gravetat = 1000;
			},
			força: function(value){
				if (value < 100)
					this.força = 100;
				else if (value > 500)
					this.força = 500;
			},
			velocitat: function(value){
				if (value < 50)
					this.velocitat = 50;
				else if (value > 300)
					this.velocitat = 300;
			},
			distMin: function(value){
				if (value < 50)
					this.distMin = 50;
				else if (value > 200)
					this.distMin = 200;
			},
			distancia: function(value){
				if (value < 50)
					this.distancia = 50;
				else if (value > 200)
					this.distancia = 200;
			},
			

		},
		methods: { 
			discard: function(){
				this.gravetat = options_data.gravetat;
				this.velocitat = options_data.velocitat;
				this.força = options_data.força;
				this.distMin = options_data.distMin;
				this.distancia = options_data.distancia;
				this.forat = options_data.forat},
			save: function(){
				options_data.gravetat = this.gravetat;
				options_data.velocitat  = this.velocitat;
				options_data.força = this.força ;
				options_data.distMin  = this.distMin;
				options_data.distancia =  this.distancia;
				options_data.forat  = this.forat;
				console.log("passa per aqui")
				save();
				
				loadpage("../");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getGravity: function (){
			return options_data.gravetat;
		},
		getVelocity: function (){
			return options_data.velocitat;
		},
		getStrenght: function(){
			return options_data.força;
		},
		getSDist: function(){
			return options_data.distMin;
		},
	}; 
}();

console.log(options.getOptionsString());
console.log(options.options_data);