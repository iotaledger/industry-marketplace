import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/use_cases'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Use-Cases</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The Industry Marketplace automates the trade of physical and digital goods / services on both a local and global level.</p>
                    <p>The Use-Cases are not limited to the production / manufacturing industry. The concept can be easily used in all industries where automated contracts provide benefits, such as Smart Cities, energy, mobility and connected vehicles, and many others.</p>
                    <h2>Use-case examples across different industries:</h2>
                    <h3>Industry 4.0, Smart manufacturing</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Purchase goods</td>
                                <td>An industrial component is requesting industry grade steel of certain specifications when stores near depletion</td>
                            </tr>
                            <tr>
                                <td>Purchase goods</td>
                                <td>An industrial component is requesting a new batch of a certain part (e.g. pass-through-block, screw, coated steel coil, nickel foam, copper wire, refrigerant gas, scaffolding pipe etc.) with certain specifications, needed in the production cycle</td>
                            </tr>
                            <tr>
                                <td>Offer data</td>
                                <td>An industrial device e.g. sensor can offer its data as a service provider. Third party services that require the data to compute an optimization can negotiate with the service provider and subscribe to that data</td>
                            </tr>
                            <tr>
                                <td>Process- and manufacturing optimization</td>
                                <td>A plant operator can offer her machine’s data on the marketplace. The original vendor of the machine can subscribe to the data through an encrypted channel. After using that data to further optimise the machine, the updates can be sent back to the machine operator</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Automotive</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>EV charging</td>
                                <td>A manned or autonomous vehicle is requesting an available EV charging slot at a nearby location or along a future route/location</td>
                            </tr>
                            <tr>
                                <td>Mobility as a service</td>
                                <td>A manned or autonomous vehicle is requested to transport a given number of persons from A to B</td>
                            </tr>
                            <tr>
                                <td>Map, digital map, route planner</td>
                                <td>A digital route planning service for manned or autonomous vehicles is requesting a route from A to B</td>
                            </tr>
                            <tr>
                                <td>Drone transport</td>
                                <td>A drone with transport capability is requested to transport a package from A to B</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Energy</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Grid stability</td>
                                <td>The grid operator issues a request for additional electricity capacity. Other grid operators issue a bid to provide this capacity. The selected operator’s backend schedules in the additional need and is paid accordingly</td>
                            </tr>
                            <tr>
                                <td>Grid stability</td>
                                <td>The grid operator issues a paid proposal to temporarily turn off a freezer to dynamically stabilize the grid during peak times. Each freezer or local smart power meter proves the off-time to the grid operator</td>
                            </tr>
                            <tr>
                                <td>Drone inspection</td>
                                <td>A drone with a high resolution camera is requested to inspect a wind power plant for potential maintenance / damage in an inaccessible area</td>
                            </tr>
                        </tbody>
                    </table>


                    <h3>Telco</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Drone connectivity</td>
                                <td>A drone with mobile network connectivity equipment, e.g. a WiFi access point, is requested to cover a specific location in order to cover a gap in connectivity</td>
                            </tr>
                            <tr>
                                <td>Power source</td>
                                <td>Network equipment that consumes a static and predictable  amount of energy can be powered with renewable sources, e.g. provided by a solar panel</td>
                            </tr>
                            <tr>
                                <td>Cell tower rent</td>
                                <td>A mobile virtual network operator (MVNO) requests access to a cell tower in a given area to provide connectivity to its customers</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Media</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Digital projector</td>
                                <td>A digital advertisement board is being rented to display a commercial</td>
                            </tr>
                            <tr>
                                <td>Video camera (digital)</td>
                                <td>Purchase of a video stream in a given area by a stationary or mobile camera / device</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="yellow_pages" />
                <NextPage page="decentralized_identification" />
            </div>
        </Layout>
    )
}
