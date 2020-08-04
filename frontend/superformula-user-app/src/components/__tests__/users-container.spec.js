import { shallowMount } from '@vue/test-utils';
import UsersContainer from '../UsersContainer';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
        addControl: jest.fn(),
        on: jest.fn(),
        remove: jest.fn()
    })),
    NavigationControl: jest.fn()
}));

const getMountedComponent = (propsData, data, mocks) => {
    return shallowMount(UsersContainer, {
        propsData,
        data,
        mocks
    })
};

describe('Users Container', () => {
    test('calls the edit user modal when the add user button is clicked', async () => {
        const modalShow = jest.fn()

        const component = getMountedComponent({}, null, {
            $apollo: {
                mutate: jest.fn()
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                show: modalShow
            }
        })

        await component.find(".users-container-header button").trigger("click");

        expect(modalShow).toBeCalled();
    });

    test('renders the show more container if nextToken is set', async () => {
        const component = getMountedComponent({}, () => {
            return {
                nextToken: "sample_token"
            };
        });

        expect(component.find(".show-more-container").exists()).toBeTruthy();
    });

    test('does not render the show more container if nextToken is not set', async () => {
        const component = getMountedComponent({});

        expect(component.find(".show-more-container").exists()).toBeFalsy();
    });

    test('renders the loading div if content is not yet loaded', async () => {
        const component = getMountedComponent({});

        expect(component.find(".users-list-loading").exists()).toBeTruthy();
    });

    test('does not render the loading div if content is already loaded', async () => {
        const component = getMountedComponent({}, () => {
            return {
                loaded: true
            };
        });

        expect(component.find(".users-list-loading").exists()).toBeFalsy();
    });

    test('does not render the users list if content is not yet loaded', async () => {
        const component = getMountedComponent({});

        expect(component.find(".users-list").exists()).toBeFalsy();
    });

    test('renders the users list if content is loaded', async () => {
        const component = getMountedComponent({}, () => {
            return {
                loaded: true
            };
        });

        expect(component.find(".users-list").exists()).toBeTruthy();
    });

    test('renders one user card per item in users data array', async () => {
        const usersData = [
            {
                id: "sample_id_1",
                name: "sample_name_1"
            },
            {
                id: "sample_id_2",
                name: "sample_name_2"
            }
        ]

        const component = getMountedComponent({}, () => {
            return {
                loaded: true,
                usersData
            };
        });

        const userCardComponents = component.findAllComponents({ name: "UserCard" });

        expect(userCardComponents).toHaveLength(2);
        expect(userCardComponents.at(0).props("user")).toBe(usersData[0]);
        expect(userCardComponents.at(1).props("user")).toBe(usersData[1]);
    });

    test('calls show more users when show more button is clicked', async () => {
        const fetchMore = jest.fn();

        const component = getMountedComponent({}, () => {
            return {
                nextToken: "sample_token"
            };
        }, {
            $apollo: {
                queries: {
                    users: {
                        fetchMore: fetchMore
                    }
                }
            },
            $toast: {
                open: jest.fn()
            },
            $modal: {
                show: jest.fn()
            }
        })

        await component.find(".show-more-container button").trigger("click");

        expect(fetchMore).toBeCalled();
    });
});