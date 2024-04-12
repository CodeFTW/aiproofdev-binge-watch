import {Meteor} from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

Meteor.startup(() => {
    ServiceConfiguration.configurations.upsert(
        { service: 'google' },
        {
            $set: {
                loginStyle: 'popup',
                ...Meteor.settings.google
            },
        }
    );

});
