import { Mongo } from 'meteor/mongo';
 
export const Tiles = new Mongo.Collection('tiles');
export const ZPT = new Mongo.Collection('zpt');

if (Meteor.isServer) {
  Meteor.publish("zpt", function(limit) {
    return ZPT.find({}, {limit: limit});
  });
}
