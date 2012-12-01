class Game
    constructor: (@ctxFront, @ctxBack, @width, @height) ->
        @resources = []
        @map = null
        @peoples = []
        @buildings = []
        @technologies = []
        @priorities = [] 
        @fps = 50

        @weather = 0
        
        @interval = null
        @realInterval = 0

        # Sprite for peoples
        @spritePeople = new Spritesheet 'img/spritePeople.png', 8
        @spritePeopleElements = [] 
        @spritePeopleElements.push new SpriteElement(@spritePeople, 0, 0)
        @spritePeopleElements.push new SpriteElement(@spritePeople, 1, 0)
        @spritePeopleElements.push new SpriteElement(@spritePeople, 2, 0)
        @spritePeopleElements.push new SpriteElement(@spritePeople, 3, 0)

        @spriteBuildings = new Spritesheet 'img/spriteBuildings.png', 10

        @WEATHER_SUN = 0
        @WEATHER_RAIN = 1
        @WEATHER_WARM = 2
        @WEATHER_SNOW = 3

        @BUILDING_TYPE_TEMPLE = 0
        @BUILDING_TYPE_HOUSE = 1
        @BUILDING_TYPE_FARM = 2
        @BUILDING_TYPE_GRANARY = 3
        @BUILDING_TYPE_PASTURE = 4
        @BUILDING_TYPE_SAWMILL = 5
        @BUILDING_TYPE_HUNTING_LODGE = 6
        @BUILDING_TYPE_HARBOR = 7

        #BUILDING COSTS
        @GRANARY_COST = 10
        @TEMPLE_COST = 20
        @HOUSE_COST = 5
        @FARM_COST = 2
        @HUNTING_LODGE_COST = 2
        @PASTURE_COST = 3
        @HARBOR_COST = 5
        @SAWMILL_COST = 3

        #DIVERS
        @FOOD_COMSUPTION = 1

        #PRIORITIES
        @PRIORITY_IDDLE = 0
        @PRIORITY_FOOD = 1
        @PRIORITY_WOOD = 2
        @PRIORITY_FAITH = 3
        @PRIORITY_GRANARY = 4
        @PRIORITY_HOUSE = 5


        #TECH
        @TECH_FIRE = 0
        @TECH_BREEDING = 1
        
        @TECH_WHEEL = 3
        @TECH_AGRICULTURE = 4

        @TECH_PAPER = 6
        @TECH_MAP = 7
        @TECH_ARCHITECTURE = 8

        @TECH_FISH = 10

        #resources
        @MANA = 0
        @FOOD = 1
        @WOOD = 2


    init: () ->
        # First, we initialize all the spritesheets
        @map = new Map(@width, @height)
        @map.init()
        @map.draw(@ctxBack)

        @resources = [10,10,200]

        for i in [1..10]
            @addPeople()

        #Then we start with 1 House, 2 hunting lodge, and 1 sawmill
        @build @BUILDING_TYPE_HOUSE
        @build @BUILDING_TYPE_HUNTING_LODGE
        @build @BUILDING_TYPE_HUNTING_LODGE
        @build @BUILDING_TYPE_SAWMILL 


        @priorities = [0,0,0,0,0]
        @technologies = [false, false, false, false, false, false, false, false, false, false, false, false]

        @interval = setInterval @myLoop, 100

    myLoop: () =>
        # Clear front canvas
        @ctxFront.clearRect 0, 0, @width, @height
        
        document.getElementById('pop_count').innerHTML = @peoples.length
        document.getElementById('mana_count').innerHTML = @resources[0]
        document.getElementById('food_count').innerHTML = @resources[1]
        document.getElementById('wood_count').innerHTML = @resources[2]


        if @realInterval % 30 == 0
            @nextTurn()

        # Perform actions
        for people in @peoples
            people.walk()
            people.draw @ctxFront

        for building in @buildings
            building.draw @ctxBack

        @realInterval += 1

    addPeople: () ->
        r = Math.round(Math.random() * (@spritePeopleElements.length-1))
        people = new People Math.round(@map.widthMap/2)*50, Math.round(@map.heightMap/2)*50, @spritePeopleElements[r]
        people.draw(@ctxFront)
        @peoples.push people

        return people

    drawWeather: (ctx) ->
        if @weather == @WEATHER_SNOW
            console.log 'snow'

        else if @weather == @WEATHER_WARM
            console.log 'warm'

        else if @weather == @WEATHER_RAIN
            console.log 'rain'
            img = new Image()
            img.src = 'img/cloud.png'

            ctx.globalAlpha = 0.2

            r = Math.round(Math.random() * 10)
            for i in [0..r]
                ctx.drawImage img, Math.round(Math.random()*@width), Math.round(Math.random()*@height), 251, 188
        else
            console.log 'else'
            ctx.globalAlpha = 0
            ctx.clearRect 0, 0, @width, @height

    nextTurn: () ->
        console.log "nextTurn"

        foodCapacity = 20

        for building in @buildings
            if building.type == @BUILDING_TYPE_GRANARY
                    foodCapacity += 20

        #food expanses
        sum = @peoples.length * @FOOD_COMSUPTION
        if  sum > @resources[@FOOD]
            numberOfDeath = sum - @resources[@FOOD]
            @resources[@FOOD] = 0
            @priorities[@PRIORITY_FOOD] = numberOfDeath * 4
        else
            @priorities[@PRIORITY_FOOD] = foodCapacity - @resources[@FOOD]
            @resources[@FOOD] -= sum

         #basic food capacity
        foodToAdd = 0
        woodToAdd = 0
        maxPeople = 5 #basic max of people
        
        for building in @buildings
            switch building.type
                when @BUILDING_TYPE_TEMPLE
                    @resources[@MANA]++
                
                when @BUILDING_TYPE_FARM
                    foodToAdd += 4
                
                when @BUILDING_TYPE_PASTURE
                    foodToAdd += 6
                
                when @BUILDING_TYPE_HUNTING_LODGE
                    foodToAdd += 2
                    #depends of boats :)
                
                when @BUILDING_TYPE_SAWMILL
                    woodToAdd += 4
                
                
                
                when @BUILDING_TYPE_HOUSE
                    maxPeople +=7

        if @resources[@FOOD]+foodToAdd > foodCapacity
            #Our peoples need more granary!
            @priorities[@PRIORITY_GRANARY] = foodToAdd
            foodToAdd = foodCapacity - @resources[@FOOD] 

        @resources[@FOOD] += foodToAdd
        @resources[@WOOD] += woodToAdd
        
        #Calculate if we need to build more temples
        

        console.log "We are "+@peoples.length
        console.log "They gonna die : "+numberOfDeath

        #kill peoples
        killCounter = numberOfDeath
        while killCounter > 0
           killCounter--
           deadIndex = Math.floor(Math.random()*@peoples.length)
           @peoples.splice deadIndex, 1




        #create peoples
        if numberOfDeath > 0
            numberOfBorn = 0.125* Math.random()*@peoples.length
            #create 1/8 peoples size * random factor
        else
            numberOfBorn = Math.random()*@peoples.length
            #create 1/4 peoples size * random factor

        bornCounter = Math.floor numberOfBorn
        while bornCounter > 0
            bornCounter--
            if maxPeople == @peoples.length
                @priorities[@PRIORITY_HOUSE]++
            else
                @addPeople()            

        #build buildings! (only 1 per turn)
        maxIndex = 0
        for priority,k in @priorities
            console.log "in loop : k = " + k + "| priority = " + priority
            if priority > @priorities[maxIndex]
                maxIndex = k
        #console.log "______________________________________________________________"
        #console.log "Want to build food : " + @priorities[@PRIORITY_FOOD]
        #console.log "PRIORITY : " + maxIndex + "| Value : " + @priorities[maxIndex]
        

        @commonSenseBuild maxIndex
        

    commonSenseBuild: (maxIndex) ->
        #PRIORITY_IDDLE = 0
        #PRIORITY_FOOD = 1
        #PRIORITY_WOOD = 2
        #PRIORITY_FAITH = 3
        #PRIORITY_GRANARY = 4
        switch maxIndex
            #when PRIORITY_IDDLE

            when @PRIORITY_GRANARY
                if @build @BUILDING_TYPE_GRANARY
                    @priorities[@PRIORITY_GRANARY] = 0
                else
                    @priorities[@PRIORITY_WOOD] += @GRANARY_COST
            when @PRIORITY_WOOD
                if @build @BUILDING_TYPE_SAWMILL
                    @priorities[@PRIORITY_WOOD] = 0
                else
                    @priorities[@PRIORITY_WOOD] += @SAWMILL_COST
            when @PRIORITY_FAITH
                if @build @BUILDING_TYPE_TEMPLE
                    @priorities[@PRIORITY_FAITH] = 0
                else
                    @priorities[@PRIORITY_WOOD] += @TEMPLE_COST
            when @PRIORITY_FOOD
                #if @build @BUILDING_TYPE_PASTURE or @build @BUILDING_TYPE_FARM or @build @BUILDING_TYPE_HUNTING_LODGE
                if @build @BUILDING_TYPE_HUNTING_LODGE
                    @priorities[@PRIORITY_FOOD] = 0

                else
                    #we majorate by the strongest cost
                    @priorities[@PRIORITY_WOOD] += @PASTURE_COST



    #Waiting for a integer : building type
    #We can only build on empty slot
    build: (type) ->
        #BUILDING_TYPE_TEMPLE = 0
        #BUILDING_TYPE_HOUSE = 1
        #BUILDING_TYPE_FARM = 2
        #BUILDING_TYPE_GRANARY = 3
        #BUILDING_TYPE_PASTURE = 4
        #BUILDING_TYPE_SAWMILL = 5
        #BUILDING_TYPE_HUNTING_LODGE = 6
        #BUILDING_TYPE_HARBOR = 7

        switch type
            when @BUILDING_TYPE_TEMPLE
                if @TEMPLE_COST > @resources[@WOOD] then return false
                #find a slot for the building
                pos = @findSlot "sand"
                if pos[0] == -1 
                    pos = @findSlot "grass"
                    if pos[0] == -1 then return true #we don't build it, and we can't :(
                building = new Building @BUILDING_TYPE_TEMPLE, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @TEMPLE_COST
                return true

            when @BUILDING_TYPE_HUNTING_LODGE
                console.log "I WANT TO BUILD HUNTING LODGE :" + @HUNTING_LODGE_COST + " > " + @resources[@WOOD]
                if @HUNTING_LODGE_COST > @resources[@WOOD] then return false
                #create a new building
                pos = @findSlot "grass"
                if pos[0] == -1 then return true #we don't build it, and we can't :(
                building = new Building @BUILDING_TYPE_HUNTING_LODGE, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @HUNTING_LODGE_COST
                console.log "SUCCESS : final wood " + @resources[@WOOD]
                return true

            when @BUILDING_TYPE_PASTURE 
                if @PASTURE_COST > @resources[@WOOD] or !@technologies[@TECH_BREEDING] then return false
                pos = @findSlot "mountain"
                if pos[0] == -1 then return true #we don't build it, and we can't :(
                
                building = new Building @BUILDING_TYPE_PASTURE, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @PASTURE_COST
                return true

            when @BUILDING_TYPE_HOUSE 
                console.log "I WANT TO BUILD HOUSE :" + @HOUSE_COST + " > " + @resources[@WOOD]
                if @HOUSE_COST > @resources[@WOOD] then return false
                pos = @findSlot "grass"
                if pos[0] == -1 then return true
                
                building = new Building @BUILDING_TYPE_HOUSE, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @HOUSE_COST
                console.log "SUCCESS : final wood " + @resources[@WOOD]
                return true

            when @BUILDING_TYPE_FARM
                if @FARM_COST > @resources[@WOOD] or !@technologies[@TECH_AGRICULTURE] then return false
                #create a new building
                pos = @findSlot "grass"
                if pos[0] == -1 then return true #we don't build it, and we can't :(
                
                building = new Building @BUILDING_TYPE_FARM, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @FARM_COST
                return true

            when @BUILDING_TYPE_GRANARY 
                console.log "I WANT TO BUILD GRANARY :" + @GRANARY_COST + " > " + @resources[@WOOD]
                if @GRANARY_COST > @resources[@WOOD] then return false
                pos = @findSlot "grass"
                if pos[0] == -1 then return true 
                building = new Building @BUILDING_TYPE_GRANARY, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @GRANARY_COST
                console.log "SUCCESS : final wood " + @resources[@WOOD]
                return true

            when @BUILDING_TYPE_SAWMILL 
                console.log "I WANT TO BUILD SAWMILL :" + @SAWMILL_COST + " > " + @resources[@WOOD]
                if @SAWMILL_COST > @resources[@WOOD] then return false
                pos = @findSlot "mountain"
                if pos[0] == -1
                    pos = @findSlot "grass"
                if pos[0] == -1 then return true 
                building = new Building @BUILDING_TYPE_SAWMILL, @spriteBuildings
                building.posX = pos[0]
                building.posY = pos[1]
                @map.tiles[pos[0]][pos[1]].building = building
                @buildings.push building
                @resources[@WOOD] -= @SAWMILL_COST

                console.log "SUCCESS : final wood " + @resources[@WOOD]
                return true

            when @BUILDING_TYPE_HARBOR
                if @HARBOR_COST > @resources[@WOOD] or !@technologies[@TECH_FISH] then return false
                #create a new building
                return true

    #type : string
    #find a slot for a building. Return coord of this slot, or [-1,-1] if not found :(
    findSlot: (searchType) ->

        for i in [0..@map.widthMap]
            for j in [0..@map.heightMap]
                # console.log "searching for : " + searchType + " | but i have : " + @map.tiles[i][j].type
                if @map.tiles[i][j].type == searchType and @map.tiles[i][j].building == null
                    # console.log "@map.tiles[i][j].building : " + @map.tiles[i][j].building
                    return [i,j]
        return [-1,-1]




if typeof module isnt 'undefined' && module.exports
    exports.Game = Game
else 
    window.Game = Game
