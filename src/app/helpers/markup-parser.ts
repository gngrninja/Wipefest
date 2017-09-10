export module MarkupParser {

    class Tag {
        constructor(
            public tag: string,
            public properties: Property[],
            public text: string) { }
    }

    class Rule {
        constructor(
            public propertyName: string,
            public template: string,
            public propertyValueTransform: (value: string) => string = x => x,
            public tagTextTransform: (text: string) => string = x => x) { }
    }

    class Property {
        constructor(
            public name: string,
            public value: string) { }
    }

    const rules = [
        new Rule("url", `<a href="$0" target="_blank" rel="noopener noreferrer">$1</a>`),
        new Rule("style", `<span class="$0">$1</span>`, style => style.split(" ").map(s => `markup-${s}`).join(" "))
    ]

    export function Parse(input: string): string {
        let tags = getMatches(input, /{\[(.+?)] (.+?)}/g)
            .map(t => {
                let properties = getMatches(t[1], /([^ ]+?)=("|')(.+?)("|')/g)
                    .map(p => new Property(p[1], p[3]));

                return new Tag(t[0], properties, t[2]);
            });

        tags.forEach(tag => {
            input = input.replace(tag.tag, parseTag(tag));
        });

        return input;
    }

    function getMatches(input: string, regex: RegExp): string[][] {
        let matches: string[][] = [];

        let result;
        while ((result = regex.exec(input)) != null) {
            if (result.index == regex.lastIndex) {
                regex.lastIndex++;
            }

            matches.push(result);
        }

        return matches;
    }

    function parseTag(tag: Tag) {
        return applyProperties(tag.text, tag.properties);
    }

    function applyProperties(input: string, properties: Property[]): string {
        properties.forEach(property => input = applyProperty(input, property, rules.find(x => x.propertyName == property.name)));

        return input;
    }

    function applyProperty(input: string, property: Property, rule: Rule): string {
        return rule.template.replace("$0", rule.propertyValueTransform(property.value)).replace("$1", rule.tagTextTransform(input));
    }

}
