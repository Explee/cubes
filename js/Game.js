// Generated by CoffeeScript 1.10.0
(function() {
  var Game,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Game = (function() {
    function Game(ctxFront, ctxBack, ctxWeather, width, height) {
      this.ctxFront = ctxFront;
      this.ctxBack = ctxBack;
      this.ctxWeather = ctxWeather;
      this.width = width;
      this.height = height;
      this.myLoop = bind(this.myLoop, this);
      this.resources = [];
      this.map = null;
      this.peoples = [];
      this.alivePeople = 0;
      this.boats = [];
      this.buildings = [];
      this.technologies = [];
      this.priorities = [];
      this.fps = 50;
      this.weather = 0;
      this.timeSameWeather = 0;
      this.weatherElements = [];
      this.weatherDraw = false;
      this.interval = null;
      this.realInterval = 0;
      this.score = 1;
      this.maxPop = 0;
      this.spritePeople = new Spritesheet('img/spritePeople.png', 8);
      this.spritePeopleElements = [];
      this.spritePeopleElements.push(new SpriteElement(this.spritePeople, 0, 0));
      this.spritePeopleElements.push(new SpriteElement(this.spritePeople, 1, 0));
      this.spritePeopleElements.push(new SpriteElement(this.spritePeople, 2, 0));
      this.spritePeopleElements.push(new SpriteElement(this.spritePeople, 3, 0));
      this.spriteBuildings = new Spritesheet('img/spriteBuildings.png', 10);
      this.WEATHER_SUN = 0;
      this.WEATHER_RAIN = 1;
      this.WEATHER_WARM = 2;
      this.WEATHER_SNOW = 3;
      this.BUILDING_TYPE_TEMPLE = 0;
      this.BUILDING_TYPE_HOUSE = 1;
      this.BUILDING_TYPE_FARM = 2;
      this.BUILDING_TYPE_GRANARY = 3;
      this.BUILDING_TYPE_PASTURE = 4;
      this.BUILDING_TYPE_SAWMILL = 5;
      this.BUILDING_TYPE_HUNTING_LODGE = 6;
      this.BUILDING_TYPE_HARBOR = 7;
      this.BUILDING_NUMBER_HARBOR = 0;
      this.GRANARY_COST = 20;
      this.TEMPLE_COST = 40;
      this.HOUSE_COST = 10;
      this.FARM_COST = 10;
      this.HUNTING_LODGE_COST = 10;
      this.PASTURE_COST = 20;
      this.HARBOR_COST = 30;
      this.SAWMILL_COST = 10;
      this.BOAT_COST = 5;
      this.FOOD_COMSUPTION = 1;
      this.MAX_AGE = 50;
      this.DEATH_FROM_ICE = 0;
      this.PRIORITY_IDDLE = 0;
      this.PRIORITY_FOOD = 1;
      this.PRIORITY_WOOD = 2;
      this.PRIORITY_FAITH = 3;
      this.PRIORITY_GRANARY = 4;
      this.PRIORITY_HOUSE = 5;
      this.PRIORITY_HARBOR = 6;
      this.FOOD_FARM = 8;
      this.FOOD_PASTURE = 12;
      this.FOOD_HUNTING = 4;
      this.FOOD_HUNTING_FIRE = 6;
      this.FOOD_BOAT = 2;
      this.TECH_FIRE = 0;
      this.TECH_BREEDING = 1;
      this.TECH_WHEEL = 3;
      this.TECH_AGRICULTURE = 4;
      this.TECH_PAPER = 6;
      this.TECH_MAP = 7;
      this.TECH_ARCHITECTURE = 8;
      this.TECH_FISH = 10;
      this.MANA = 0;
      this.FOOD = 1;
      this.WOOD = 2;
    }

    Game.prototype.init = function() {
      var i, l;
      this.map = new Map(this.ctxBack, this.width, this.height);
      this.map.init();
      this.map.draw();
      this.resources = [10, 10, 50];
      for (i = l = 1; l <= 10; i = ++l) {
        this.addPeople();
      }
      this.build(this.BUILDING_TYPE_HOUSE);
      this.build(this.BUILDING_TYPE_HUNTING_LODGE);
      this.build(this.BUILDING_TYPE_HUNTING_LODGE);
      this.build(this.BUILDING_TYPE_SAWMILL);
      this.priorities = [0, 0, 0, 0, 0, 0, 0];
      this.technologies = [false, false, false, false, false, false, false, false, false, false, false, false];
      return this.interval = setInterval(this.myLoop, 100);
    };

    Game.prototype.myLoop = function() {
      var boat, building, elem, i, j, l, len, len1, len2, len3, len4, m, mx, my, n, o, p, people, ref, ref1, ref2, ref3, ref4, scoreTech, tech;
      this.ctxFront.clearRect(0, 0, this.width, this.height);
      document.getElementById('pop_count').innerHTML = this.alivePeople;
      document.getElementById('mana_count').innerHTML = this.resources[0];
      document.getElementById('food_count').innerHTML = this.resources[1];
      document.getElementById('wood_count').innerHTML = this.resources[2];
      if (this.realInterval % 30 === 0) {
        this.nextTurn();
        this.addWeatherElements();
      }
      if (this.alivePeople < 1) {
        clearInterval(this.interval);
        scoreTech = 1;
        ref = this.technologies;
        for (l = 0, len = ref.length; l < len; l++) {
          tech = ref[l];
          if (tech) {
            scoreTech *= 5;
          }
        }
        this.score = scoreTech + this.maxPop * 4 + this.buildings.length * 10 + this.boats.length * 2;
        document.getElementById('count').innerHTML = this.score;
      }
      if (this.weatherDraw) {
        this.ctxWeather.clearRect(0, 0, this.width, this.height);
        if (this.weather === this.WEATHER_SNOW) {
          this.ctxWeather.globalAlpha = 0.2;
          this.ctxWeather.fillStyle = 'white';
          this.ctxWeather.fillRect(0, 0, this.width, this.height);
        } else if (this.weather === this.WEATHER_RAIN) {
          this.ctxWeather.globalAlpha = 0.3;
          this.ctxWeather.fillStyle = '#6088a4';
          this.ctxWeather.fillRect(0, 0, this.width, this.height);
        }
        ref1 = this.weatherElements;
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          elem = ref1[m];
          elem.posX += Math.round(Math.random() * 2);
          elem.posY += 1;
          elem.draw(this.ctxWeather);
        }
      }
      ref2 = this.peoples;
      for (n = 0, len2 = ref2.length; n < len2; n++) {
        people = ref2[n];
        if (!people.isDead && !people.walk()) {
          j = Math.round(Math.random() * this.map.heightMap);
          i = Math.round(Math.random() * this.map.widthMap);
          while (this.map.tiles[i][j].type === "water") {
            j = Math.round(Math.random() * this.map.heightMap);
            i = Math.round(Math.random() * this.map.widthMap);
          }
          people.findNewGoal(i * 50, j * 50);
        }
        people.draw(this.ctxFront);
      }
      ref3 = this.boats;
      for (o = 0, len3 = ref3.length; o < len3; o++) {
        boat = ref3[o];
        mx = Math.floor(boat.posX / 50 + 0.5);
        my = Math.floor(boat.posY / 50 + 0.5);
        if (this.map.tiles[mx][my].type === "water" && !boat.navigate()) {
          if (this.technologies[this.TECH_MAP]) {
            j = boat.srcY + Math.round(Math.random() * 5 - 2);
            i = boat.srcX + Math.round(Math.random() * 5 - 2);
            while (i > 0 && j > 0 && i < this.map.widthMap && j < this.map.heightMap && this.map.tiles[i][j].type !== "water") {
              j = boat.srcY + Math.round(Math.random() * 5 - 2);
              i = boat.srcX + Math.round(Math.random() * 5 - 2);
            }
            boat.findNewGoal(i * 50 + 10, j * 50 + 10);
          } else {
            j = boat.srcY + Math.round(Math.random() * 3 - 1);
            i = boat.srcX + Math.round(Math.random() * 3 - 1);
            while (i > 0 && j > 0 && i < this.map.widthMap && j < this.map.heightMap && this.map.tiles[i][j].type !== "water") {
              j = boat.srcY + Math.round(Math.random() * 3 - 1);
              i = boat.srcX + Math.round(Math.random() * 3 - 1);
            }
            boat.findNewGoal(i * 50 + 10, j * 50 + 10);
          }
        }
        boat.draw(this.ctxFront);
      }
      ref4 = this.buildings;
      for (p = 0, len4 = ref4.length; p < len4; p++) {
        building = ref4[p];
        building.draw(this.ctxBack);
      }
      return this.realInterval += 1;
    };

    Game.prototype.addPeople = function() {
      var building, houses, index, l, len, people, r, ref;
      houses = [];
      ref = this.buildings;
      for (l = 0, len = ref.length; l < len; l++) {
        building = ref[l];
        if (building.type === this.BUILDING_TYPE_HOUSE) {
          houses.push(building);
        }
      }
      if (!houses.length > 0) {
        r = Math.round(Math.random() * (this.spritePeopleElements.length - 1));
        people = new People(Math.round(this.map.widthMap / 2) * 50, Math.round(this.map.heightMap / 2) * 50, this.spritePeopleElements[r]);
      } else {
        index = Math.floor(Math.random() * houses.length);
        r = Math.round(Math.random() * (this.spritePeopleElements.length - 1));
        people = new People(houses[index].posX * 50 + 25, houses[index].posY * 50 + 25, this.spritePeopleElements[r]);
      }
      people.draw(this.ctxFront);
      this.peoples.push(people);
      return people;
    };

    Game.prototype.addWeatherElements = function() {
      var cloud, i, l, r, ref, snow;
      if (this.weather === this.WEATHER_SNOW) {
        r = Math.round(Math.random() * 5);
        for (i = l = 0, ref = r; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
          snow = new Snow(Math.round(Math.random() * this.width / 10) - 100, Math.round(Math.random() * this.height));
          this.weatherElements.push(snow);
        }
        return this.weatherDraw = true;
      } else if (this.weather === this.WEATHER_WARM) {
        return console.log('warm');
      } else if (this.weather === this.WEATHER_RAIN) {
        this.ctxWeather.globalAlpha = 0.2;
        r = Math.random();
        if (r > 0.55) {
          cloud = new Cloud(Math.round(Math.random() * this.width / 15) - 100, Math.round(Math.random() * this.height));
          this.weatherElements.push(cloud);
        }
        return this.weatherDraw = true;
      }
    };

    Game.prototype.drawWeather = function() {
      var cloud, i, l, m, r, ref, ref1, snow;
      if (this.weather === this.WEATHER_SNOW) {
        this.weatherElements = [];
        r = Math.round(Math.random() * 10) + 40;
        for (i = l = 0, ref = r; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
          snow = new Snow(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
          this.weatherElements.push(snow);
        }
        return this.weatherDraw = true;
      } else if (this.weather === this.WEATHER_WARM) {
        this.weatherElements = [];
        this.ctxWeather.clearRect(0, 0, this.width, this.height);
        this.ctxWeather.globalAlpha = 0.3;
        this.ctxWeather.fillStyle = '#f0df44';
        this.ctxWeather.fillRect(0, 0, this.width, this.height);
        return this.weatherDraw = false;
      } else if (this.weather === this.WEATHER_RAIN) {
        this.weatherElements = [];
        this.ctxWeather.globalAlpha = 0.2;
        r = Math.round(Math.random() * 10) + 5;
        for (i = m = 0, ref1 = r; 0 <= ref1 ? m <= ref1 : m >= ref1; i = 0 <= ref1 ? ++m : --m) {
          cloud = new Cloud(Math.round(Math.random() * this.width), Math.round(Math.random() * this.height));
          this.weatherElements.push(cloud);
        }
        return this.weatherDraw = true;
      } else {
        this.ctxWeather.globalAlpha = 0;
        return this.ctxWeather.clearRect(0, 0, this.width, this.height);
      }
    };

    Game.prototype.nextTurn = function() {
      var boat, bornCounter, building, coldDie, deadIndex, foodCapacity, foodToAdd, hunterCount, i, iPeople, j, k, killCounter, l, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, manaToAdd, maxIndex, maxMana, maxPeople, mountainCount, n, numberOfBorn, numberOfDeath, o, oldWeather, p, people, peoplesToDel, priority, q, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, speople, sum, t, templeCount, u, v, w, woodCapacity, woodToAdd, x, y, z;
      oldWeather = this.weather;
      foodCapacity = 20;
      woodCapacity = 5;
      numberOfDeath = 0;
      ref = this.buildings;
      for (l = 0, len = ref.length; l < len; l++) {
        building = ref[l];
        if (building.type === this.BUILDING_TYPE_GRANARY) {
          foodCapacity += 30;
        }
        if (building.type === this.BUILDING_TYPE_SAWMILL) {
          woodCapacity += 20;
        }
      }
      this.alivePeople = this.peoples.length;
      ref1 = this.peoples;
      for (m = 0, len1 = ref1.length; m < len1; m++) {
        people = ref1[m];
        if (people.isDead) {
          this.alivePeople--;
        }
      }
      sum = this.alivePeople * this.FOOD_COMSUPTION;
      if (sum > this.resources[this.FOOD]) {
        numberOfDeath = sum - this.resources[this.FOOD];
        this.resources[this.FOOD] = 0;
        this.priorities[this.PRIORITY_FOOD] = numberOfDeath * 4;
      } else {
        this.priorities[this.PRIORITY_FOOD] = (foodCapacity - this.resources[this.FOOD]) / 3;
        this.resources[this.FOOD] -= sum;
      }
      foodToAdd = 0;
      woodToAdd = 0;
      manaToAdd = 1;
      maxPeople = 5;
      maxMana = 15;
      ref2 = this.boats;
      for (n = 0, len2 = ref2.length; n < len2; n++) {
        boat = ref2[n];
        x = Math.round(boat.posX / 50);
        y = Math.round(boat.posY / 50);
        if ((this.map.tiles[x][y] != null) && this.map.tiles[x][y].res > 0 && this.map.tiles[x][y] === "water") {
          this.map.tiles[x][y].res--;
          foodToAdd += this.FOOD_BOAT;
        }
      }
      ref3 = this.buildings;
      for (o = 0, len3 = ref3.length; o < len3; o++) {
        building = ref3[o];
        if (this.map.tiles[building.posX][building.posY].res <= 0) {
          continue;
        }
        this.map.tiles[building.posX][building.posY].res--;
        switch (building.type) {
          case this.BUILDING_TYPE_TEMPLE:
            manaToAdd++;
            maxMana += 15;
            break;
          case this.BUILDING_TYPE_FARM:
            foodToAdd += this.FOOD_FARM;
            break;
          case this.BUILDING_TYPE_PASTURE:
            foodToAdd += this.FOOD_PASTURE;
            break;
          case this.BUILDING_TYPE_HUNTING_LODGE:
            if (this.technologies[this.TECH_FIRE]) {
              foodToAdd += this.FOOD_HUNTING_FIRE;
            } else {
              foodToAdd += this.FOOD_HUNTING;
            }
            break;
          case this.BUILDING_TYPE_SAWMILL:
            woodToAdd += 4;
            break;
          case this.BUILDING_TYPE_HOUSE:
            if (this.technologies[this.TECH_ARCHITECTURE]) {
              maxPeople += 12;
            } else {
              maxPeople += 9;
            }
        }
      }
      if (this.resources[this.MANA] + manaToAdd > maxMana) {
        manaToAdd = maxMana - this.resources[this.MANA];
      }
      if (this.resources[this.FOOD] + foodToAdd > foodCapacity) {
        this.priorities[this.PRIORITY_GRANARY] = foodToAdd;
        foodToAdd = foodCapacity - this.resources[this.FOOD];
      }
      if (this.resources[this.WOOD] + woodToAdd > woodCapacity) {
        woodToAdd = woodCapacity - this.resources[this.WOOD];
      }
      this.resources[this.FOOD] += foodToAdd;
      this.resources[this.WOOD] += woodToAdd;
      this.resources[this.MANA] += manaToAdd;
      killCounter = numberOfDeath;
      while (killCounter > 0) {
        deadIndex = Math.floor(Math.random() * this.peoples.length);
        if (!this.peoples[deadIndex].isDead) {
          killCounter--;
          this.peoples[deadIndex].isDead = true;
        }
      }
      peoplesToDel = [];
      ref4 = this.peoples;
      for (p = 0, len4 = ref4.length; p < len4; p++) {
        people = ref4[p];
        if (people.isDead) {
          people.timeDead++;
          if (people.timeDead > 5) {
            peoplesToDel.push(people);
          }
        }
      }
      for (q = 0, len5 = peoplesToDel.length; q < len5; q++) {
        iPeople = peoplesToDel[q];
        this.peoples.splice(this.peoples.indexOf(iPeople), 1);
      }
      this.priorities[this.PRIORITY_FAITH]++;
      if (numberOfDeath > 0) {
        numberOfBorn = 0.125 * Math.random() * this.alivePeople;
      } else {
        numberOfBorn = Math.random() * this.alivePeople;
      }
      ref5 = this.peoples;
      for (k = s = 0, len6 = ref5.length; s < len6; k = ++s) {
        speople = ref5[k];
        speople.age++;
        if (Math.random() * this.MAX_AGE < speople.age) {
          if (!speople.isDead) {
            speople.isDead = true;
          }
        }
      }
      bornCounter = Math.floor(numberOfBorn);
      while (bornCounter > 0) {
        bornCounter--;
        if (maxPeople === this.alivePeople) {
          this.priorities[this.PRIORITY_HOUSE] += 3;
        } else {
          this.addPeople();
        }
      }
      maxIndex = 0;
      ref6 = this.priorities;
      for (k = t = 0, len7 = ref6.length; t < len7; k = ++t) {
        priority = ref6[k];
        if (priority > this.priorities[maxIndex]) {
          maxIndex = k;
        }
      }
      this.commonSenseBuild(maxIndex);
      if (this.weather === this.WEATHER_SNOW) {
        coldDie = Math.random() * 10 < 2;
        if (coldDie) {
          if (this.technologies[this.TECH_FIRE]) {
            killCounter = 1 / 10 * this.alivePeople;
          } else {
            killCounter = 1 / 3 * this.alivePeople;
          }
          while (killCounter > 0) {
            deadIndex = Math.floor(Math.random() * this.peoples.length);
            if (!this.peoples[deadIndex].isDead) {
              killCounter--;
              this.peoples[deadIndex].isDead = true;
              this.DEATH_FROM_ICE++;
            }
          }
        }
      }
      if (!this.technologies[this.TECH_FIRE] && this.weather === this.WEATHER_RAIN && this.DEATH_FROM_ICE >= 5) {
        this.discover(this.TECH_FIRE);
      }
      if (!this.technologies[this.TECH_WHEEL]) {
        mountainCount = 0;
        for (i = u = 0, ref7 = this.map.widthMap; 0 <= ref7 ? u <= ref7 : u >= ref7; i = 0 <= ref7 ? ++u : --u) {
          for (j = v = 0, ref8 = this.map.heightMap; 0 <= ref8 ? v <= ref8 : v >= ref8; j = 0 <= ref8 ? ++v : --v) {
            if (this.map.tiles[i][j].type === "mountain") {
              mountainCount++;
            }
          }
        }
        if (mountainCount > 2) {
          this.discover(this.TECH_WHEEL);
        }
      }
      if (!this.technologies[this.TECH_AGRICULTURE] && this.technologies[this.TECH_WHEEL] && this.alivePeople > 50 && this.weather === this.WEATHER_WARM) {
        this.discover(this.TECH_AGRICULTURE);
      }
      if (!this.technologies[this.TECH_BREEDING] && this.technologies[this.TECH_FIRE]) {
        hunterCount = 0;
        ref9 = this.buildings;
        for (w = 0, len8 = ref9.length; w < len8; w++) {
          building = ref9[w];
          if (building.type === this.BUILDING_TYPE_HUNTING_LODGE) {
            hunterCount++;
          }
        }
        if (hunterCount > 5) {
          this.discover(this.TECH_BREEDING);
        }
      }
      if (!this.technologies[this.TECH_PAPER] && this.technologies[this.TECH_FIRE] && this.peoples.length > 100) {
        this.discover(this.TECH_PAPER);
      }
      if (!this.technologies[this.TECH_ARCHITECTURE] && this.technologies[this.TECH_PAPER] && this.peoples.length > 200) {
        templeCount = 0;
        ref10 = this.buildings;
        for (z = 0, len9 = ref10.length; z < len9; z++) {
          building = ref10[z];
          if (building.type === this.BUILDING_TYPE_TEMPLE) {
            templeCount++;
          }
        }
        this.discover(this.TECH_ARCHITECTURE);
      }
      if (!this.technologies[this.TECH_FISH] && this.resources[this.WOOD] >= 80) {
        this.discover(this.TECH_FISH);
      }
      if (!this.technologies[this.TECH_FISH] && this.resources[this.WOOD] >= 80) {
        this.discover(this.TECH_FISH);
      }
      if (!this.technologies[this.TECH_MAP] && this.technologies[this.TECH_PAPER] && this.technologies[this.TECH_FISH] && boats.length > 5) {
        this.discover(this.TECH_MAP);
      }
      if (oldWeather !== this.weather) {
        this.timeSameWeather = 0;
      } else {
        this.timeSameWeather++;
      }
      if (this.technologies[this.TECH_FISH] && this.BUILDING_NUMBER_HARBOR === 0) {
        return this.priorities[this.PRIORITY_HARBOR] += 3;
      }
    };

    Game.prototype.discover = function(indexTechno) {
      var name;
      this.technologies[indexTechno] = true;
      name = '';
      if (indexTechno === this.TECH_ARCHITECTURE) {
        name = 'architecture';
      } else if (indexTechno === this.TECH_PAPER) {
        name = 'paper';
      } else if (indexTechno === this.TECH_FIRE) {
        name = 'fire';
      } else if (indexTechno === this.TECH_BREEDING) {
        name = 'breeding';
      } else if (indexTechno === this.TECH_WHEEL) {
        name = 'wheel';
      } else if (indexTechno === this.TECH_AGRICULTURE) {
        name = 'agriculture';
      } else if (indexTechno === this.TECH_FISH) {
        name = 'fish';
      } else if (indexTechno === this.TECH_MAP) {
        name === 'map';
      }
      document.getElementById('technos').innerHTML = 'You just discovered ' + name + '!';
      return console.log('DISCOVERED ' + name);
    };

    Game.prototype.commonSenseBuild = function(maxIndex) {
      switch (maxIndex) {
        case this.PRIORITY_GRANARY:
          if (this.build(this.BUILDING_TYPE_GRANARY)) {
            return this.priorities[this.PRIORITY_GRANARY] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.GRANARY_COST;
          }
          break;
        case this.PRIORITY_WOOD:
          if (this.build(this.BUILDING_TYPE_SAWMILL)) {
            return this.priorities[this.PRIORITY_WOOD] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.SAWMILL_COST;
          }
          break;
        case this.PRIORITY_FAITH:
          if (this.build(this.BUILDING_TYPE_TEMPLE)) {
            return this.priorities[this.PRIORITY_FAITH] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.TEMPLE_COST;
          }
          break;
        case this.PRIORITY_FOOD:
          if (this.technologies[this.TECH_FISH] && this.BUILDING_NUMBER_HARBOR > 0 && this.resources[this.WOOD] > this.BOAT_COST && this.boats.length < 5) {
            this.buildABoat();
            return this.priorities[this.PRIORITY_FOOD] = 0;
          } else if (this.build(this.BUILDING_TYPE_PASTURE) || this.build(this.BUILDING_TYPE_FARM) || this.build(this.BUILDING_TYPE_HUNTING_LODGE)) {
            return this.priorities[this.PRIORITY_FOOD] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.PASTURE_COST;
          }
          break;
        case this.PRIORITY_HOUSE:
          if (this.build(this.BUILDING_TYPE_HOUSE)) {
            return this.priorities[this.PRIORITY_HOUSE] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.HOUSE_COST;
          }
          break;
        case this.PRIORITY_HARBOR:
          if (this.build(this.BUILDING_TYPE_HARBOR)) {
            return this.priorities[this.PRIORITY_HARBOR] = 0;
          } else {
            return this.priorities[this.PRIORITY_WOOD] += this.HARBOR_COST;
          }
      }
    };

    Game.prototype.buildABoat = function() {
      var building, harborList, indn, l, len, ref;
      harborList = [];
      ref = this.buildings;
      for (l = 0, len = ref.length; l < len; l++) {
        building = ref[l];
        if (building.type === this.BUILDING_TYPE_HARBOR) {
          harborList.push(building);
        }
      }
      if (harborList.length > 0) {
        indn = Math.floor(Math.random() * harborList.length);
        building = harborList[indn];
        return this.boats.push(new Boat(building.posX * 50, building.posY * 50));
      }
    };

    Game.prototype.build = function(type) {
      var building, pos;
      switch (type) {
        case this.BUILDING_TYPE_TEMPLE:
          if (this.TEMPLE_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("sand");
          if (pos[0] === -1) {
            pos = this.findSlot("grass");
            if (pos[0] === -1) {
              return true;
            }
          }
          building = new Building(this.BUILDING_TYPE_TEMPLE, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.TEMPLE_COST;
          return true;
        case this.BUILDING_TYPE_HUNTING_LODGE:
          if (this.HUNTING_LODGE_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("grass");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_HUNTING_LODGE, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.HUNTING_LODGE_COST;
          return true;
        case this.BUILDING_TYPE_PASTURE:
          if (!this.technologies[this.TECH_BREEDING] || this.PASTURE_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("mountain");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_PASTURE, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.PASTURE_COST;
          return true;
        case this.BUILDING_TYPE_HOUSE:
          if (this.HOUSE_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("grass");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_HOUSE, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.HOUSE_COST;
          return true;
        case this.BUILDING_TYPE_FARM:
          if (this.FARM_COST > this.resources[this.WOOD] || !this.technologies[this.TECH_AGRICULTURE]) {
            return false;
          }
          pos = this.findSlot("grass");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_FARM, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.FARM_COST;
          return true;
        case this.BUILDING_TYPE_GRANARY:
          if (this.GRANARY_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("grass");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_GRANARY, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.GRANARY_COST;
          return true;
        case this.BUILDING_TYPE_SAWMILL:
          if (this.SAWMILL_COST > this.resources[this.WOOD]) {
            return false;
          }
          pos = this.findSlot("mountain");
          if (pos[0] === -1) {
            pos = this.findSlot("grass");
            if (pos[0] === -1) {
              return true;
            }
          }
          building = new Building(this.BUILDING_TYPE_SAWMILL, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.SAWMILL_COST;
          return true;
        case this.BUILDING_TYPE_HARBOR:
          if (this.HARBOR_COST > this.resources[this.WOOD] || !this.technologies[this.TECH_FISH]) {
            return false;
          }
          pos = this.findSlot("harbor");
          if (pos[0] === -1) {
            return true;
          }
          building = new Building(this.BUILDING_TYPE_HARBOR, this.spriteBuildings);
          building.posX = pos[0];
          building.posY = pos[1];
          this.map.tiles[pos[0]][pos[1]].building = building;
          this.buildings.push(building);
          this.resources[this.WOOD] -= this.HARBOR_COST;
          this.BUILDING_NUMBER_HARBOR++;
          return true;
      }
    };

    Game.prototype.findSlot = function(searchType) {
      var ce, co, i, index, j, l, m, n, notWaterCounter, o, p, q, ref, ref1, ref2, ref3, results;
      results = [];
      if (searchType === "harbor") {
        for (i = l = 0, ref = this.map.widthMap; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
          for (j = m = 0, ref1 = this.map.heightMap; 0 <= ref1 ? m <= ref1 : m >= ref1; j = 0 <= ref1 ? ++m : --m) {
            if (this.map.tiles[i][j].type === "water" && this.map.tiles[i][j].building === null) {
              notWaterCounter = 0;
              for (co = n = -1; n <= 2; co = ++n) {
                for (ce = o = -1; o <= 2; ce = ++o) {
                  if (i + co > 0 && j + ce > 0 && i + co < this.map.widthMap && j + ce < this.map.heightMap && this.map.tiles[i + co][j + ce].type !== "water") {
                    notWaterCounter++;
                  }
                }
              }
              if (notWaterCounter > 1) {
                results.push([i, j]);
              }
            }
          }
        }
        if (results.length > 0) {
          i = Math.floor(Math.random() * results.length);
          return results[i];
        }
        return [-1, -1];
      }
      for (i = p = 0, ref2 = this.map.widthMap; 0 <= ref2 ? p <= ref2 : p >= ref2; i = 0 <= ref2 ? ++p : --p) {
        for (j = q = 0, ref3 = this.map.heightMap; 0 <= ref3 ? q <= ref3 : q >= ref3; j = 0 <= ref3 ? ++q : --q) {
          if (this.map.tiles[i][j].type === searchType && this.map.tiles[i][j].building === null) {
            results.push([i, j]);
          }
        }
      }
      if (results.length > 0) {
        index = Math.floor(Math.random() * results.length);
        return results[index];
      }
      return [-1, -1];
    };

    return Game;

  })();

  if (typeof module !== 'undefined' && module.exports) {
    exports.Game = Game;
  } else {
    window.Game = Game;
  }

}).call(this);
