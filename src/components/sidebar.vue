<template>
    <div  v-bind:class="{'menubar__panels--active': $root.menu_toggle}" id="menubar" class="menubar">
		<div class="menubar__top-panel">
            <img class="menubar__logo desktop" src="../../public/logo.svg" alt="logo">
			<span class="menubar__logo-text text-lg text-bold text-primary">AstroCode CMS</span>
            <i v-on:click="$root.menu_toggle=!$root.menu_toggle" class="menubar__bars fa fa-bars fa-fw icon mobile"></i>
		</div>
		<div class="menubar__main-panel desktop">
            <ul id="main-menu" class="menubar__menu">
                <li class="desktop">
                    <router-link to="/Home">
                        <i class="fa fa-home fa-fw icon"></i>
                        <span class="card__title">Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/ContentEditing">
                        <i class="fa fa-puzzle-piece fa-fw icon"></i>
                        <span class="card__title">Content Editing</span>
                    </router-link>
                </li>
                <li class="desktop">
                    <router-link to="/Textbook">
                        <i class="fa fa-book fa-fw icon"></i>
                        <span class="card__title">Textbook</span>
                    </router-link>
                </li>
                <li class="desktop">
                    <router-link to="/PriceList">
                        <i class="fa fa-shopping-cart fa-fw icon"></i>
                        <span class="card__title">Price Management</span>
                    </router-link>
                </li>
                <li class="desktop">
                    <router-link to="/Publications">
                        <i class="md md-publish fa-fw icon"></i>
                        <span class="card__title">Publications</span>
                    </router-link>
                </li>
            </ul>
		</div>
        <div class="menubar__bottom-panel desktop">
            <i v-on:click="$root.menu_toggle=!$root.menu_toggle" class="fa fa-angle-right fa-fw icon"></i>
        </div>
	</div>
</template>