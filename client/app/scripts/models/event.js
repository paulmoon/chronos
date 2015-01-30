Chronos.Event = DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    startDate: DS.attr('date'),
    endDate: DS.attr('date'),
    location: DS.attr('string'),

    shortDescription: function() {
        desc = this.get('description');
        return desc.length > 140 ? desc.slice(0, 140) + '...' : desc;
    }.property('description')
});

Chronos.Event.reopen({
    attributes: function () {
        var model = this;
        return Ember.keys(this.get('data')).map(function (key) {
            return Em.Object.create({model: model, key: key, valueBinding: 'model.' + key});
        });
    }.property()
});

Chronos.Event.FIXTURES = [
    {
        id: 0,
        title: 'Victoria Beer Week 2015',
        description: "We're excited to announce the second annual Victoria Beer Week, March 7-15, 2015!",
        start_date: 'March 7, 2015',
        end_date: 'March 15, 2015',
        location: '2725 Rock Bay Ave., Victoria, British Columbia'
    },
    {
        id: 1,
        title: 'Beyonce & Jay Z Tribute Night - February 27th, Lucky Bar',
        description: "Back by popular demand! \
\
      Lucky Bar, Victoria hosts a night dedicated to:\
\
Beyoncé & JAY Z tribute w/ Live performances. Doors 10pm",
        start_date: 'Friday, February 27 at 10:00pm',
        end_date: 'Saturday, February 28 at 2:00am',
        location: '517 Yates St, Victoria, British Columbia V8W 1K7'
    },
    {
        id: 2,
        title: 'Victoria Spoken Word Festival 201',
        description: "The fifth annual Victoria Spoken Word Festival is bringing back all of our favourite poets to form an all star line-up for a week-long celebration of spoken word in the heart of downtown Victoria.",
        start_date: 'Feb 23 at 8:00pm',
        end_date: 'Mar 1 at 10:00pm',
        location: '2-1609 Blanshard, Victoria, British Columbia V8W 2J5'
    }
];
