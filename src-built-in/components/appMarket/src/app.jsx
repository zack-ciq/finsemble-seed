/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/
/**
 * This component is the name of a component and a pin that will pin that component to all toolbars.
 *
 */
import React from "react";
import ReactDOM from 'react-dom';
import * as storeExports from "./stores/appCatalogStore";

//components
import SearchBar from './components/SearchBar';
import Home from './components/Home';
import AppResults from './components/AppResults';
import AppShowcase from './components/Showcase/AppShowcase';

//data
import * as appCatalogStore from './stores/appCatalogStore.js';

//style
import '../appMarket.css';

export default class AppMarket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: "home",
			activeApp: null,
			installationActionTaken: null
		};
		appCatalogStore.initialize();
		appCatalogStore.Actions.setTags();
		this.bindCorrectContext();
	}
	bindCorrectContext() {
		this.goHome = this.goHome.bind(this);
		this.addTag = this.addTag.bind(this);
		this.removeTag = this.removeTag.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		this.openAppShowcase = this.openAppShowcase.bind(this);
		this.addApp = this.addApp.bind(this);
		this.removeApp = this.removeApp.bind(this);
		this.stopShowingInstalledNotification = this.stopShowingInstalledNotification.bind(this);
	}
	addTag(tag) {
		appCatalogStore.Actions.addTag(tag);
		let tags = appCatalogStore.Actions.getActiveTags();

		let page = this.state.activePage;

		if (tags.length === 1) {
			page = "appSearch";
		}

		this.setState({
			activePage: page
		});
	}
	removeTag(tagName) {
		appCatalogStore.Actions.removeTag(tagName);
		let tags = appCatalogStore.Actions.getActiveTags();

		let page = this.state.activePage;

		if (tags.length === 0) {
			page = "home";
			appCatalogStore.Actions.clearSearchResults();
		}

		this.setState({
			activePage: page
		});
	}
	goHome() {
		appCatalogStore.Actions.clearTags();
		appCatalogStore.Actions.clearSearchResults();
		this.setState({
			activePage: "home",
			activeApp: null
		});
	}
	changeSearch(search) {

		if (search) {
			appCatalogStore.Actions.searchApps(search);

			this.setState({
				activePage: "appSearch"
			});
		} else {
			appCatalogStore.Actions.clearSearchResults();

			this.setState({
				activePage: appCatalogStore.Actions.getActiveTags().length === 0 ? "home" : this.state.activePage
			});
		}
	}
	addApp(appName) {
		//TODO: This won't work when this comes from a db
		appCatalogStore.Actions.addApp(appName);

		this.setState({
			apps: appCatalogStore.Actions.getApps(),
			installationActionTaken: "add"
		}, () => {
			setTimeout(this.stopShowingInstalledNotification, 1000);
		});
	}
	removeApp(appName) {
		//TODO: This won't work when this comes from a db
		appCatalogStore.Actions.removeApp(appName);

		this.setState({
			apps: appCatalogStore.Actions.getApps(),
			installationActionTaken: "remove"
		}, () => {
			setTimeout(this.stopShowingInstalledNotification, 1000);
		})
	}
	stopShowingInstalledNotification() {
		this.setState({
			installationActionTaken: null
		});
	}
	openAppShowcase(appName) {
		//clear tags
		appCatalogStore.Actions.clearTags();

		let app;
		let apps = appCatalogStore.Actions.getApps();
		for (let i = 0; i < apps.length; i++) {
			let thisApp = apps[i];
			let thisAppName = thisApp.title || thisApp.name;

			if (appName === thisAppName) {
				app = thisApp;
				break;
			}
		}

		if (app) {
			this.setState({
				activeApp: app,
				activePage: "showcase"
			});
		}
	}
	render() {

		let tags = appCatalogStore.Actions.getTags();
		let apps = appCatalogStore.Actions.getApps();
		let activeTags = appCatalogStore.Actions.getActiveTags();
		let filteredApps = appCatalogStore.Actions.getFilteredApps();

		let pageContents;

		if (this.state.activePage === "home") {
			pageContents = <Home cards={apps} openAppShowcase={this.openAppShowcase} seeMore={this.addTag} addApp={this.addApp} removeApp={this.removeApp} addTag={this.addTag} />;
		} else if (this.state.activePage === "appSearch") {
			pageContents = <AppResults cards={filteredApps} tags={activeTags} addApp={this.addApp} removeApp={this.removeApp} openAppShowcase={this.openAppShowcase} addTag={this.addTag} />;
		} else if (this.state.activePage === "showcase") {
			pageContents = <AppShowcase app={this.state.activeApp} addApp={this.addApp} removeApp={this.removeApp} addTag={this.addTag} />;
		} else {
			pageContents = <div></div>;
		}

		return (
			<div>
				<SearchBar backButton={this.state.activePage !== "home"} tags={tags} activeTags={activeTags} tagSelected={this.addTag} removeTag={this.removeTag} goHome={this.goHome} changeSearch={this.changeSearch} installationActionTaken={this.state.installationActionTaken} />
				<div className="market_content">
					{pageContents}
				</div>
			</div>
		);
	}
}

FSBL.addEventListener("onReady", function () {

	storeExports.Actions.initialize(function (store) {
		ReactDOM.render(
			<AppMarket />
			, document.getElementById("bodyHere"));
	});
});