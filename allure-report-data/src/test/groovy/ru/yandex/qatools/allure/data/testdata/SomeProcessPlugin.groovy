package ru.yandex.qatools.allure.data.testdata

import ru.yandex.qatools.allure.data.plugins.PluginData
import ru.yandex.qatools.allure.data.plugins.ProcessPlugin

/**
 * @author Dmitry Baev charlie@yandex-team.ru
 *         Date: 18.02.15
 */
class SomeProcessPlugin implements ProcessPlugin {
    @Override
    void process(Object data) {
    }

    @Override
    List<PluginData> getPluginData() {
        return null
    }

    @Override
    Class getType() {
        return null
    }
}
