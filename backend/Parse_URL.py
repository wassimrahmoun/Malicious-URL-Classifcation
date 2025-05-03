from urllib.parse import urlparse
import re
import tldextract


def extract_url_features(url, words_list):

    parsed_url = urlparse(url)

    # Domain Features
    domain = parsed_url.netloc
    domain_length = len(domain)
    num_subdomains = domain.count('.')
    has_hyphen = '-' in domain

    # Path Features
    path = parsed_url.path
    path_length = len(path)
    num_path_segments = path.count('/')

    # Top-Level Domain (TLD) Features
    tld_info = tldextract.extract(domain)
    tld = tld_info.suffix
    tld_length = len(tld)
    subdomain = tld_info.subdomain

    # Protocol Features
    protocol = parsed_url.scheme
    is_https = protocol == 'https'

    # Query Parameters Features
    query_params = parsed_url.query
    num_query_params = len(query_params.split('&'))

    # Define a fixed set of character features
    char_features = list("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~!*'()$&+,;=:/?#@[]{}|\\^")

    # Calculate character frequencies for the defined characters
    char_frequencies = {char: url.lower().count(char) for char in char_features}

    # Calculate keyword counts for the defined keywords
    keyword_counts = {keyword: url.lower().count(keyword) for keyword in words_list}

    # URL Length Features
    url_length = len(url)

    # URL Structure Features
    has_redirect = '->' in url
    has_shortened_url = re.search(r'bit\.ly|t\.co|ow\.ly', url) is not None


    feature_array = [
        domain_length, num_subdomains, int(has_hyphen),
        path_length, num_path_segments, tld_length,
        int(is_https), num_query_params, url_length,
        int(has_redirect), int(has_shortened_url)
    ]

    # Add character frequencies as features in a fixed order
    feature_array.extend([char_frequencies[char] for char in char_features])

    # Add keyword counts as features in a fixed order
    feature_array.extend([keyword_counts[keyword] for keyword in words_list])

    return feature_array