censusSOE = {
	// Pattern Globals
	// http://census.soe.com/get/ps2:v2/outfit/?name=Derp%20Company
	BASE_URL: 'https://census.soe.com/',
	CENSUS_URL: 'https://census.soe.com/s:OverwolfPS2App/',
	
	// Games
	G_PS2_LATEST: 'ps2:v2/',
	G_PS2_V2: 'ps2:v2/',
	//G_PS2_V2: 'ps2:v1/',
	//G_PS2_BETA: 'ps2-beta/',
	
	// Verbs
	V_Get: 'get/',
	V_Count: 'count/',
	V_Image: 'files/ps2/images/static/',
	
	// Collections
	C_Outfits: 'outfit/',
	C_OutfitMembers: 'outfit_member/',
	C_CharacterItems: 'characters_item/',
	C_Character: 'character/',
	C_Items: 'item/',
	C_Image: 'icon/',
	C_CharacterFriends: 'characters_friend/',
	C_CharacterCurrency: 'characters_currency/',	
	C_CharacterEvents: 'characters_event/',
	C_Factions: 'faction/',
	C_Profile: 'profile',
	// ImageTypes
	I_Item: '/item',
	    
	// Returns the '<img>'
	GetImage: function (id, callback) {
		var url = censusSOE.BASE_URL + censusSOE.V_Image + id + ".png";
		//Old format -> http://census.soe.com/img/game/collection/id[/imageType]
		//New format -> https://census.soe.com/files/ps2/images/static/5391.png
		callback($('<img>').attr('src', url));
	},
	
	// GetData Function Signatures
	// GetData (game, collection, id, data, callback)
	// GetData (game, collection, id, callback)
	GetData: function (game, collection, id, data, callback) {
		var url = censusSOE.CENSUS_URL + censusSOE.V_Get + game + collection + id;
		// http://census.soe.com/get/game/collection/id[/?clauses]'
		
		if (!callback) {
			callback = data;
			data = {};
		}
		
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: function (data) {
				callback(data);
			},
			error: function (e) {
				alert('Error: ' + e.message);
			}
		});
	},
	
	// Cond Function Signatures
	// Cond (id, condition)
	// Cond (condition)
	Cond: function (id, condition) {
		var delimiter = '?';
		if (!condition) {
			condition = id;
			id = "";
		}
		else {
			delimiter = '/?';
		}
		
		return id + delimiter + condition;
	},
	GetFullProfileById: function (characterId, callback) {
		//http://census.soe.com/get/ps2/C_Character/?character_id=characterId&c:resolve=profile,faction,stat,weapon_stat,online_status,outfit,currency&c:join=type:profile^inject_at:profile^show:image_id&c:join=type:faction^inject_at:faction^show:image_id
		var clause = 'character_id=' + characterId + "&c:resolve=character_name&c:resolve=profile,faction,online_status,outfit,currency&c:join=type:profile^inject_at:profile^show:image_id&c:join=type:faction^inject_at:faction^show:image_id";
		var tools = censusSOE;
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_Character, censusSOE.Cond(clause), function (json) {
			callback(json.character_list[0]);
		});
	},
	GetCharacterIdByName: function (characterName, callback) {
		//http://census.soe.com/get/ps2:v2/character/?name.first_lower=litebrite&c:show=character_id,name
		var clause = 'name.first_lower=' + characterName.toLowerCase() + '&c:show=character_id,name&c:resolve=outfit';
		var tools = censusSOE;
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_Character, censusSOE.Cond(clause), function (json) {
			callback(json.character_list);
		});
	},
	GetKillboardById: function (characterId, callback) {
        //http://census.soe.com/get/ps2:v2/characters_event/?character_id=5428010618041058369&c:limit=15&type=DEATH,KILL&c:resolve=character(name,battle_rank,faction_id,profile_id),attacker(name,battle_rank,faction_id,profile_id)&c:join=type:vehicle^on:attacker_vehicle_id^to:vehicle_id^inject_at:vehicle^show:name&c:lang=en&c:join=type:item^on:attacker_weapon_id^to:item_id^inject_at:weapon^show:name&c:lang=en&c:join=type:profile^on:character.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:profile^on:attacker.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:faction^on:attacker.faction_id^to:faction_id^inject_at:faction^show:image_id&c:join=type:faction^on:character.faction_id^to:faction_id^inject_at:faction^show:image_id
        var clause = 'character_id=' + characterId + "&c:limit=15&type=DEATH,KILL&c:resolve=character(name,battle_rank,faction_id,profile_id),attacker(name,battle_rank,faction_id,profile_id)&c:join=type:vehicle^on:attacker_vehicle_id^to:vehicle_id^inject_at:vehicle^show:name&c:lang=en&c:join=type:item^on:attacker_weapon_id^to:item_id^inject_at:weapon^show:name&c:lang=en&c:join=type:profile^on:character.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:profile^on:attacker.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:faction^on:attacker.faction_id^to:faction_id^inject_at:faction^show:image_id&c:join=type:faction^on:character.faction_id^to:faction_id^inject_at:faction^show:image_id";
		var tools = censusSOE;
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_CharacterEvents, censusSOE.Cond(clause), function (json) {
			callback(json.characters_event_list);
		});
	}
};
