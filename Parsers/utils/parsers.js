const win_7_re = {
  big_group:
    /(?<big_group>Source.*[\r\n]Domain:.*[\r\n]Type:.*[\r\n]ID:.*[\r\n]Date:.*[\r\n]Text:.*)\n?/g,
  small_group:
    /Source:(?<source_group>.*)[\r\n]Domain:(?<domain_group>.*)[\r\n]Type:(?<type_group>.*)[\r\n]ID:(?<id_group>.*)[\r\n](Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<host_time>.*))[\r\n]Text:(?<text_group>.*)\n?/,
};

const win_10_re = {
  re_v1:
    /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<source_group>(.*?(\d+)?)(\.\d\.\d)?)\t?\s?(?<type_group>(\d{1,5}))\t(?<text_group>.*)/,
};

const ge_re = {
  test: {
    for_box: /|/,
    for_exception_class: /Exception\sClass\s?:/,
    for_task_id: /Task\sID:/,
  },
  mri: {
    gesys: {
      block:
      /SR\s(\d+).*?EN\s\1/gs, ///(?<block>SR(.+)((\r?\n.+)*)[\r\n]+(.+)((\r?\n.+)*)[\n\r]+EN\s\d+)/g
      no_box:
        /SR\s(?<sr_group>\d+)[\n\r](?<time_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>(-)?\d+)\s(?<num_4>(-)?\d+)\s+(\w+)\s(?<type>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\s(?<data_2>(.+)((\r?\n.+)*))[\n\r]+\s?EN\s(?<en>\d+)/,
      box: /SR\s(?<sr_group>\d+).*\s+(?<time_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+(.+)\s(?<type>.*)\s+(?<data_1>.*?)\s+(?<num_5>\d+)\s+(?:Server\sName:\s(?<server_name>\w+)\s+(|))?\s+(?<data_2>.*(\s+).*)\s+EN\s(?<en>.*)/,
      exception_class:
        /SR\s(?<sr_group>\d+)[\n\r](?<time_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+(.+)\s(?<type>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\sException\sClass:\s(?<exception_class>(.+)((\r?\n.+)*))[\n\r]\sEN\s(?<en>\d+)/,
      task_id:
        /SR\s(?<sr_group>\d+)[\n\r](?<time_stamp>\d+)\s+(?<num_1>\d+)\s+(?<num_2>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<num_3>\d+)\s(?<num_4>\d+)\s+(.+)\s(?<type>.*)[\n\r](?<data_1>.*?)\s+(?<num_5>\d+)[\n\r]\sTask\sID:\s(?<task_id>.*?)\s+Time:\s(?<time_2>\d+)\s+Object:\s(?<object>.*)[\n\r]Exception\sClass:\s(?<exception_class>(.+)((\r?\n.+)*))[\n\r]\sEN\s(?<en>\d+)/,
      new: /(?:SR\s(?<sr>.+?)[\n\r])(?<epoch>.+?)\s(?<record_number_concurrent>.+?)\s(?<misc_param_1>.+?)\s\w+\s(?<month>.+?)\s+(?<day>.+?)\s(?<host_time>.+?)\s(?<year>.+?)\s(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?.+?)\s+(?<type>.+?)[\n\r]((?<data_1>.*?)\s?)\s+(?<num_1>\d+?)[\n\r]\s(?:Server\sName:\s(?<server>.+?)[\n\r])?(?:Task ID: (?<task_id>.+?)\s+Time: (?<task_epoc>.+?)\s+Object: (?<object>.+?)[\n\r])?(?:Exception\s?Class:\s?(?<exception_class>.+?)\s+)?(?:Severity:\s(?<severity>.+?)[\n\r])?(?:Function:\s(?<function>.+?)[\n\r])?(?:PSD:\s(?<psd>.+?)\s+Coil:\s(?<coil>.+?)\s+Scan:\s(?<scan>.+?)[\n\r])?(?<message>.+?)(?:EN\s(?<en>\d+))/s, //(?:SR\s(?<sr>.+?)[\n\r])(?<epoch>.+?)\s(?<record_number_concurrent>.+?)\s(?<misc_param_1>.+?)\s\w+\s(?<month>.+?)\s+(?<day>.+?)\s(?<host_time>.+?)\s(?<year>.+?)\s(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?.+?)\s+(?<type>.+?)[\n\r]((?<data_1>.*?)\s)\s+(?<num_1>.+?)[\n\r]\s(?:Server\sName:\s(?<server>.+?)[\n\r])?(?:Task ID: (?<task_id>.+?)\s+Time: (?<task_epoc>.+?)\s+Object: (?<object>.+?)[\n\r])?(?:Exception\s?Class:\s?(?<exception_class>.+?)\s+)?(?:Severity:\s(?<severity>.+?)[\n\r])?(?:Function:\s(?<function>.+?)[\n\r])?(?:PSD:\s(?<psd>.+?)\s+Coil:\s(?<coil>.+?)\s+Scan:\s(?<scan>.+?)[\n\r])?(?<message>.+?)(?:EN\s(?<en>\d+))
    },
  },
  ct: {
    gesys: {
      block: /SR\s(\d+).*?EN\s\1/gs,
      no_box:
        /SR\s(?<sr>\d+)[\n\r](?<epoch>\d+)\s+(?<record_number_concurrent>\d+)\s+(?<misc_param_1>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?\d+)\s+(?<type>.+?)[\n\r](?<data_1>.*?)\s+(?<num_1>\d+)[\n\r]\s(?<message>(.+)((\r?\n.+)*))[\n\r]+\s?EN\s(?<en>\d+)/s,
      exception_class:
        /SR\s(?<sr>\d+)[\n\r](?<epoch>\d+)\s+(?<record_number_concurrent>\d+)\s+(?<misc_param_1>\d+)\s+\w+\s(?<month>\w+)\s+(?<day>\d+)\s(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\s(?<year>\d+)\s+(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?\d+)\s+(?<type>.+?)[\n\r](?<data_1>.*?)\s+(?<num_1>\d+)[\n\r]\s(?<date_2>.+?)[\n\r](?:Host\s:\s(?<host>.+?))\s+(?:Ermes\s\#\s:\s(?<ermes_number>.+?))[\n\r](?:Exception Class\s:\s(?<exception_class>.+?)\s+)(?:Severity\s:\s(?<severity>.+?))[\n\r](?:File\s:\s(?<file>.+?)\s+)(?:Line\#\s:\s(?<line_number>\d+))[\n\r](?:Function\s:\s(.+?))[\n\r](?:Scan\sType\s:\s(.+?))([\n\r]+)(?<message>.+?)([\n\r]+)(?:EN\s(?<en>\d+))/s,
    },
  },
  cv: {
    sys_error:
      /(?<sequencenumber>.+?),(?<host_date>.+?),(?<host_time>.+?),(?<subsystem>.+?),(?<errorcode>.+?),(?<errortext>.+?),(?<exam>.+?),(?<exceptioncategory>.+?),(?<application>.+?),(?<majorfunction>.+?),(?<minorfunction>.+?),(?<fru>.+?),(?<viewinglevel>.+?),(?<rootcause>.+?),(?<repeatcount>.+?),(?<debugtext>".+"?|.+?),(?<sourcefile>.+?),(?<sourceline>.+)/,
  },
};

const philips_re = {
  ct_eal:
    /(?<line>.*?)[|](?<err_type>.*?)[|](?<tmstamp>.*?)[|](?<file>.*?)[|](?<datatype>.*?)[|](?<param1>.*?)[|](?<errnum>.*?)[|](?<info>.*?)(\s+)?[|](?<dtime>.*?)[|](?<ealtime>.*?)[|](?<lognumber>.*?)[|](?<param2>.*?)[|](?<vxwerrno>.*?)[|](?<controller>.*?)?/,
  mri_logcurrent:
    /((?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2}\.\d+)\s(?<row_type>\w+)\s(?<event_type>\w+)\s(?<subsystem>.*?)\s+(?<code_1>\w+)\s(?<code_2>\w+)(\s(?<group_1>\w+))?\s+(?<message>.*))|(Number\sof\sPackets\sCreated\s:\s(?<packets_created>\d*\.?\d*)|Total\sSize\sof\sData\sCreated\s:\s(?<data_created_gb>\d*\.?\d*)\s[A-Z]+|Size\sof\sCopy\sDone\s:\s(?<size_copy_gb>\d*\.?\d*)\s[A-Z]+|(?<data_8>>.*)|(?<reconstructor>[A-Za-z].*))/,
};

module.exports = {
  win_7_re,
  win_10_re,
  ge_re,
  philips_re,
};
